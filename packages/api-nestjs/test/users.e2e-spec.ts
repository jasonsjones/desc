import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UsersService } from '../src/users/users.service';
import { AuthUtilsService } from '../src/utils/auth-utils.service';
import { AppModule } from './../src/app.module';
import { extractCookieValueFromResHeader } from './utils/auth-utils';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let usersService: UsersService;

    const userData: CreateUserDto = {
        firstName: 'John',
        lastName: 'Diggle',
        email: 'dig@desc.org',
        password: '123456',
        program: 'HOUSING_FIRST'
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        usersService = moduleFixture.get<UsersService>(UsersService);
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('/users (GET)', () => {
        it('returns the two seeded users', () => {
            return request(app.getHttpServer())
                .get('/users')
                .expect(200)
                .expect(({ body }) => {
                    expect(body).toHaveLength(2);
                });
        });
    });

    describe('/users (POST)', () => {
        afterEach(async () => {
            await usersService.removeByEmail(userData.email);
        });

        it('creates a new user', () => {
            return request(app.getHttpServer())
                .post('/users')
                .set('Content-Type', 'application/json')
                .send(userData)
                .expect(201)
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
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                email: userData.email,
                                program: userData.program
                            })
                        })
                    );
                });
        });
    });

    describe('/users/:id (GET)', () => {
        let userId: string;
        beforeEach(async () => {
            const user = await usersService.create(userData);
            userId = user.id;
        });

        afterEach(async () => {
            await usersService.removeByEmail(userData.email);
        });

        it('fetches the user with the given id', () => {
            return request(app.getHttpServer())
                .get(`/users/${userId}`)
                .expect(200)
                .expect(({ body }) => {
                    userId = body.id;
                    expect(body).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: userData.email,
                            program: userData.program
                        })
                    );
                });
        });
    });

    describe('/users/:id (PATCH)', () => {
        let userId: string;
        beforeEach(async () => {
            const user = await usersService.create(userData);
            userId = user.id;
        });

        afterEach(async () => {
            await usersService.removeById(userId);
        });
        it('updates the user with the given id', () => {
            return request(app.getHttpServer())
                .patch(`/users/${userId}`)
                .set('Content-Type', 'application/json')
                .send({ email: 'diggle@desc.org' })
                .expect(200)
                .expect(({ body }) => {
                    userId = body.id;
                    expect(body).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: 'diggle@desc.org',
                            program: userData.program
                        })
                    );
                });
        });
    });

    describe('/users/:id (DELETE)', () => {
        let userId: string;
        beforeEach(async () => {
            const user = await usersService.create(userData);
            userId = user.id;
        });

        it('deletes the user with the given id', () => {
            return request(app.getHttpServer())
                .delete(`/users/${userId}`)
                .expect(200)
                .expect(({ body }) => {
                    userId = body.id;
                    expect(body).toEqual(
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: userData.email,
                            program: userData.program
                        })
                    );
                });
        });
    });
});
