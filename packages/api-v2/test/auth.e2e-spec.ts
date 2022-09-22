import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import cookieParser from 'cookie-parser';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UsersService } from '../src/users/users.service';
import { AuthUtilsService } from '../src/utils/auth-utils.service';
import { extractCookieValueFromResHeader } from './utils/auth-utils';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let usersService: UsersService;
    let authUtilsService: AuthUtilsService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        usersService = moduleFixture.get<UsersService>(UsersService);
        authUtilsService = moduleFixture.get<AuthUtilsService>(AuthUtilsService);
        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/login (POST)', () => {
        it('authenticates a valid user', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'oliver@desc.org', password: '123456' })
                .expect(200)
                .expect(({ body, header }) => {
                    const authFlag = extractCookieValueFromResHeader(
                        header,
                        AuthUtilsService.AUTH_FLAG_COOKIE_KEY
                    );
                    const refreshToken = extractCookieValueFromResHeader(
                        header,
                        AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY
                    );
                    const rTokenParts = refreshToken.split('.');

                    expect(authFlag).toBe('true');
                    expect(rTokenParts).toHaveLength(3);
                    expect(rTokenParts[0]).toMatch(/^eyJhbGciOi/);

                    expect(body).toEqual(
                        expect.objectContaining({
                            access_token: expect.stringMatching(/^eyJhbGciOi/),
                            user: expect.objectContaining({
                                id: expect.any(String),
                                firstName: 'Oliver',
                                lastName: 'Queen',
                                email: 'oliver@desc.org',
                                program: 'RESEARCH_INNOVATION'
                            })
                        })
                    );
                });
        });

        it('sends a 401 for an invalid email', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'unknown-user@test.com', password: 'test1234' })
                .expect(401)
                .expect(({ body }) => {
                    expect(body.statusCode).toEqual(401);
                    expect(body.message).toBe('Unauthorized');
                });
        });

        it('sends a 401 for an invalid password', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'oliver@desc.org', password: 'invalidPwd' })
                .expect(401)
                .expect(({ body }) => {
                    expect(body.statusCode).toEqual(401);
                    expect(body.message).toBe('Unauthorized');
                });
        });
    });

    describe('/auth/logout (POST)', () => {
        it('returns simple logout payload', () => {
            return request(app.getHttpServer())
                .post('/auth/logout')
                .expect(200)
                .expect(({ body }) => {
                    expect(body).toEqual(
                        expect.objectContaining({
                            access_token: null
                        })
                    );
                });
        });
    });

    describe('/auth/token (GET)', () => {
        let testUser: User;
        const testUserData: CreateUserDto = {
            firstName: 'John',
            lastName: 'Diggle',
            email: 'dig@desc.org',
            password: '123456',
            program: 'HOUSING_FIRST'
        };
        beforeEach(async () => {
            testUser = await usersService.create(testUserData);
        });

        afterEach(async () => {
            await usersService.removeByEmail(testUserData.email);
        });

        it('returns access token when sent a valid refresh token', async () => {
            const validRefreshToken = authUtilsService.generateRefreshToken(testUser);

            return request(app.getHttpServer())
                .get('/auth/token')
                .set('Cookie', [`rid=${validRefreshToken}`])
                .expect(200)
                .expect(({ body, header }) => {
                    const refreshToken = extractCookieValueFromResHeader(
                        header,
                        AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY
                    );
                    const rTokenParts = refreshToken.split('.');
                    expect(rTokenParts).toHaveLength(3);
                    expect(rTokenParts[0]).toMatch(/^eyJhbGciOi/);

                    expect(body).toEqual(
                        expect.objectContaining({
                            access_token: expect.stringMatching(/^eyJhbGciOi/),
                            user: expect.objectContaining({
                                id: expect.any(String),
                                firstName: testUser.firstName,
                                lastName: testUserData.lastName,
                                email: testUserData.email,
                                program: testUserData.program
                            })
                        })
                    );
                });
        });

        it('sends 403 (forbidden) if refresh token is not provided', () => {
            return request(app.getHttpServer())
                .get('/auth/token')
                .expect(403)
                .expect(({ body, header }) => {
                    const refreshToken = extractCookieValueFromResHeader(
                        header,
                        AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY
                    );

                    expect(refreshToken).toBeUndefined();
                    expect(body.access_token).toBeUndefined();
                    expect(body.user).toBeUndefined();
                });
        });

        it('sends 403 (forbidden) if refresh token version does not match', async () => {
            const origRefreshToken = authUtilsService.generateRefreshToken(testUser);
            await usersService.update(testUser.id, { refreshTokenVersion: 1 });

            return request(app.getHttpServer())
                .get('/auth/token')
                .set('Cookie', [`rid=${origRefreshToken}`])
                .expect(403)
                .expect(({ body, header }) => {
                    const refreshToken = extractCookieValueFromResHeader(
                        header,
                        AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY
                    );

                    expect(refreshToken).toBeUndefined();
                    expect(body.access_token).toBeUndefined();
                    expect(body.user).toBeUndefined();
                    expect(body.message).toMatch(/refresh token not valid/i);
                });
        });

        it('sends 403 (forbidden) if refresh token is expired', async () => {
            const twoHoursAgo = new Date();
            twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
            jest.spyOn(authUtilsService, 'verifyRefreshToken').mockImplementation(() => {
                throw new TokenExpiredError('jwt expired', twoHoursAgo);
            });
            const expiredRefreshToken = authUtilsService.generateRefreshToken(testUser);

            return request(app.getHttpServer())
                .get('/auth/token')
                .set('Cookie', [`rid=${expiredRefreshToken}`])
                .expect(403)
                .expect(({ body, header }) => {
                    const refreshToken = extractCookieValueFromResHeader(
                        header,
                        AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY
                    );

                    expect(refreshToken).toBeUndefined();
                    expect(body.access_token).toBeUndefined();
                    expect(body.user).toBeUndefined();
                    expect(body.message).toBe('jwt expired');
                });
        });

        it('sends 403 (forbidden) if refresh token is otherwise invalid', async () => {
            jest.spyOn(authUtilsService, 'verifyRefreshToken').mockImplementation(() => {
                throw new JsonWebTokenError('jwt malformed');
            });
            const invalidRefreshToken = authUtilsService.generateRefreshToken(testUser);

            return request(app.getHttpServer())
                .get('/auth/token')
                .set('Cookie', [`rid=${invalidRefreshToken}`])
                .expect(403)
                .expect(({ body, header }) => {
                    const refreshToken = extractCookieValueFromResHeader(
                        header,
                        AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY
                    );

                    expect(refreshToken).toBeUndefined();
                    expect(body.access_token).toBeUndefined();
                    expect(body.user).toBeUndefined();
                    expect(body.message).toBe('jwt malformed');
                });
        });
    });
});
