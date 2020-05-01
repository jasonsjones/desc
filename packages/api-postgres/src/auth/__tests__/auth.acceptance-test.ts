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
    beforeAll(async () => {
        await createPostgresConnection();
    });

    afterAll(async () => {
        await closeConnection();
    });

    describe('POST /api/auth/login route', () => {
        let client: TestClient;

        beforeAll(async () => {
            client = new TestClient();
            await client.createTestUser({
                firstName: 'Oliver',
                lastName: 'Queen',
                email: 'oliver@qc.com',
                password: '123456',
                program: Program.SURVIVAL
            });
        });

        afterAll(async () => {
            await TestUtils.dropUsers();
        });

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
        });

        it('sends back status 401 for an unauthorized user', async () => {
            const response = await client.loginUser('oliver@qc.com', '654321');

            expect(response.status).toBe(401);
            expect(response.body).toStrictEqual({});
        });
    });
});
