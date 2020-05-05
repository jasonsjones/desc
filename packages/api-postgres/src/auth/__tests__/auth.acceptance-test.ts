import { createPostgresConnection, closeConnection } from '../../config/database';
import TestClient from '../../testUtils/TestClient';
import TestUtils from '../../testUtils/TestUtilities';
import { Program } from '../../common/types';

const expectedUserShape = {
    id: expect.any(String),
    name: expect.objectContaining({
        first: expect.any(String),
        last: expect.any(String)
    }),
    email: expect.any(String),
    program: expect.any(String),
    roles: ['requestor']
};

describe('Auth route acceptance tests', () => {
    let client: TestClient;
    beforeAll(async () => {
        await createPostgresConnection();
        client = new TestClient();
        await TestUtils.createTestUser({
            firstName: 'Oliver',
            lastName: 'Queen',
            email: 'oliver@qc.com',
            password: '123456',
            program: Program.SURVIVAL
        });
    });

    afterAll(async () => {
        await TestUtils.dropUsers();
        await closeConnection();
    });

    describe('POST /api/auth/login route', () => {
        it('logs in an authorized user', async () => {
            const response = await client.loginUser('oliver@qc.com', '123456');

            expect(response.body).toEqual(
                expect.objectContaining({
                    success: true,
                    message: 'user authenticated',
                    payload: expect.objectContaining({
                        user: expect.objectContaining(expectedUserShape),
                        accessToken: expect.any(String)
                    })
                })
            );

            const refreshToken = response.header['set-cookie'][0]
                .split(';')
                .find((cookie: string) => cookie.substring(0, 3) === 'qid')
                .split('=')[1];
            expect(refreshToken.split('.')).toHaveLength(3);
        });

        it('sends back status 401 for an unauthorized user', async () => {
            const response = await client.loginUser('oliver@qc.com', '654321');

            expect(response.status).toBe(401);
            expect(response.body).toStrictEqual({});
        });
    });

    describe('GET /api/auth/logout route', () => {
        it('logs out an authorized user', async () => {
            await client.loginUser('oliver@qc.com', '123456');
            const response = await client.logout();

            expect(response.body).toEqual(
                expect.objectContaining({
                    success: true,
                    message: 'user logged out',
                    payload: null
                })
            );

            const refreshToken = response.header['set-cookie'][0]
                .split(';')
                .find((cookie: string) => cookie.substring(0, 3) === 'qid')
                .split('=')[1];
            expect(refreshToken).toEqual('');
        });
    });
});
