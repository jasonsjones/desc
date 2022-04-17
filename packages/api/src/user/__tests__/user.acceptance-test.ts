import { Program } from '../../common/types/enums';
import TestClient from '../../testUtils/TestClient';
import TestUtils from '../../testUtils/TestUtilities';
import { createPostgresConnection, closeConnection } from '../../config/database';
import userService from '../UserService';

describe('User route acceptance tests', () => {
    beforeAll(async () => {
        await createPostgresConnection();
    });

    afterAll(async () => {
        await closeConnection();
    });

    describe('/api/users route', () => {
        const adminEmail = 'admin@desc.org';
        const email = 'oliver@desc.org';
        const password = '123456';

        afterEach(async () => {
            await TestUtils.dropUsers();
        });

        describe('POST request method', () => {
            it('POST request method creates a new user', async () => {
                const client = new TestClient();
                const response = await client.creatUserViaAPI({
                    firstName: 'Oliver',
                    lastName: 'Queen',
                    email,
                    password,
                    program: Program.SURVIVAL
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            user: expect.objectContaining({
                                id: expect.any(String),
                                name: expect.objectContaining({
                                    first: 'Oliver',
                                    last: 'Queen'
                                }),
                                email: 'oliver@desc.org',
                                program: expect.any(String),
                                roles: expect.arrayContaining(['requestor'])
                            })
                        })
                    })
                );
            });
        });

        describe('GET request method', () => {
            let adminClient: TestClient;
            let requestorClient: TestClient;
            beforeAll(() => {
                adminClient = new TestClient();
                requestorClient = new TestClient();
            });

            beforeEach(async () => {
                await TestUtils.createAdminTestUser({
                    firstName: 'Admin',
                    lastName: 'User',
                    email: adminEmail,
                    password,
                    program: Program.SURVIVAL
                });

                await TestUtils.createTestUser({
                    firstName: 'Oliver',
                    lastName: 'Queen',
                    email,
                    password,
                    program: Program.SURVIVAL
                });
            });

            it('GET request method fetches all users', async () => {
                await adminClient.doLogin(adminEmail, password);
                const response = await adminClient.getAllUsers();

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            users: expect.arrayContaining([expect.any(Object)])
                        })
                    })
                );
                expect(response.body.payload.users).toHaveLength(2);
            });

            it('GET request method is unsuccessful if user is not authenticated', async () => {
                adminClient.logoutUser();
                const response = await adminClient.getAllUsers();

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );
            });

            it('GET request method is unsuccessful if authenticated user is not an admin', async () => {
                await requestorClient.doLogin(email, password);
                const response = await requestorClient.getAllUsers();

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );
            });
        });
    });

    describe('/api/users/:id route', () => {
        const unknownId = '9ff6515e-814a-4d1c-bc27-9a768c4aa242';
        const adminEmail = 'admin@desc.org';
        const requestor1Email = 'oliver@desc.org';
        const requestor2Email = 'barry@desc.org';
        const password = '123456';

        let requestorId1: string;
        let requestorId2: string;
        let client: TestClient;

        beforeAll(() => {
            client = new TestClient();
        });

        beforeEach(async () => {
            await TestUtils.createAdminTestUser({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                password,
                program: Program.SURVIVAL
            });

            const user1 = await TestUtils.createTestUser({
                firstName: 'Oliver',
                lastName: 'Queen',
                email: requestor1Email,
                password,
                program: Program.SURVIVAL
            });
            requestorId1 = user1.id;

            const user2 = await TestUtils.createTestUser({
                firstName: 'Barry',
                lastName: 'Allen',
                email: requestor2Email,
                password,
                program: Program.HOUSING
            });
            requestorId2 = user2.id;
        });

        afterEach(async () => {
            await TestUtils.dropUsers();
        });

        describe('GET request method', () => {
            it('fetches the user with the given id', async () => {
                await client.doLogin(requestor1Email, password);
                const response = await client.getUser(requestorId1);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            user: expect.any(Object)
                        })
                    })
                );
            });

            it('does not fetch user info if the requestor is not an admin or self', async () => {
                await client.doLogin(requestor1Email, password);
                const response = await client.getUser(requestorId2);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );
            });

            it('with invalid user id returns a null user in the payload', async () => {
                // need to log in as admin to verify
                await client.doLogin(adminEmail, password);
                const response = await client.getUser(unknownId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );
            });
        });

        describe('PATCH request method', () => {
            it('updates the user with the given id', async () => {
                await client.doLogin(requestor1Email, password);
                const response = await client.updateUser(requestorId1, { firstName: 'Ollie' });

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            user: expect.any(Object)
                        })
                    })
                );
            });

            it('does not update user info if the requestor is not an admin or self', async () => {
                await client.doLogin(requestor2Email, password);
                const response = await client.updateUser(requestorId1, { firstName: 'Ollie' });

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );
            });

            it('with invalid user id returns a null user in the payload', async () => {
                // need to log in as admin to verify
                await client.doLogin(adminEmail, password);
                const response = await client.updateUser(unknownId, { firstName: 'Ollie' });

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );
            });
        });

        describe('DELETE request method', () => {
            async function verifyNumberOfUsers(num: number): Promise<void> {
                // log in as admin in order to call the 'getAllUsers' route
                await client.doLogin(adminEmail, password);
                const verificatonResponse = await client.getAllUsers();
                expect(verificatonResponse.body.payload.users).toHaveLength(num);
            }

            it('deletes the user with the given id', async () => {
                await client.doLogin(requestor1Email, password);
                const response = await client.deleteUser(requestorId1);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            user: expect.any(Object)
                        })
                    })
                );

                await verifyNumberOfUsers(2);
            });

            it('does not delete a user if the requestor is not an admin or self', async () => {
                await client.doLogin(requestor2Email, password);
                const response = await client.deleteUser(requestorId1);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );

                await verifyNumberOfUsers(3);
            });

            it('with invalid user id returns a null user in the payload (does not delete any user)', async () => {
                // need to log in as admin to verify
                await client.doLogin(adminEmail, password);
                const response = await client.deleteUser(unknownId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );

                await verifyNumberOfUsers(3);
            });
        });
    });

    describe('/api/users/:id/deactivate route', () => {
        const unknownId = '9ff6515e-814a-4d1c-bc27-9a768c4aa242';
        const adminEmail = 'admin@desc.org';
        const requestor1Email = 'oliver@desc.org';
        const requestor2Email = 'barry@desc.org';
        const password = '123456';

        let requestorId1: string;
        let requestorId2: string;
        let client: TestClient;

        beforeAll(() => {
            client = new TestClient();
        });

        afterEach(async () => {
            await TestUtils.dropUsers();
        });

        beforeEach(async () => {
            await TestUtils.createAdminTestUser({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                password,
                program: Program.SURVIVAL
            });

            const user1 = await TestUtils.createTestUser({
                firstName: 'Oliver',
                lastName: 'Queen',
                email: requestor1Email,
                password,
                program: Program.SURVIVAL
            });
            requestorId1 = user1.id;

            const user2 = await TestUtils.createTestUser({
                firstName: 'Barry',
                lastName: 'Allen',
                email: requestor2Email,
                password,
                program: Program.HOUSING
            });
            requestorId2 = user2.id;
        });

        describe('POST request method', () => {
            it('deactivates an active user', async () => {
                await client.doLogin(adminEmail, password);
                const response = await client.deactivateUser(requestorId1);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'user deactivated',
                        payload: expect.objectContaining({
                            user: expect.objectContaining({
                                isActive: false
                            })
                        })
                    })
                );
            });

            it('returns a null user in the payload if the user id does not exist', async () => {
                await client.doLogin(adminEmail, password);
                const response = await client.deactivateUser(unknownId);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'user not found',
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );
            });

            it('returns an error if a non-admin attempts to deactivate another user', async () => {
                await client.doLogin(requestor1Email, password);
                const response = await client.deactivateUser(requestorId2);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: expect.stringMatching(/^Error/),
                        payload: expect.objectContaining({
                            error: expect.stringMatching(/insufficient access/i)
                        })
                    })
                );
            });
        });
    });

    describe('/api/users/:id/activate route', () => {
        const unknownId = '9ff6515e-814a-4d1c-bc27-9a768c4aa242';
        const adminEmail = 'admin@desc.org';
        const requestor1Email = 'oliver@desc.org';
        const requestor2Email = 'barry@desc.org';
        const password = '123456';

        let requestorId1: string;
        let requestorId2: string;
        let client: TestClient;

        beforeAll(() => {
            client = new TestClient();
        });

        afterEach(async () => {
            await TestUtils.dropUsers();
        });

        beforeEach(async () => {
            await TestUtils.createAdminTestUser({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                password,
                program: Program.SURVIVAL
            });

            const user1 = await TestUtils.createTestUser({
                firstName: 'Oliver',
                lastName: 'Queen',
                email: requestor1Email,
                password,
                program: Program.SURVIVAL
            });
            requestorId1 = user1.id;

            const user2 = await TestUtils.createTestUser({
                firstName: 'Barry',
                lastName: 'Allen',
                email: requestor2Email,
                password,
                program: Program.HOUSING
            });
            requestorId2 = user2.id;
        });

        describe('POST request method', () => {
            it('activates an inactive user', async () => {
                await client.doLogin(adminEmail, password);
                await client.deactivateUser(requestorId1);
                const response = await client.activateUser(requestorId1);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'user activated',
                        payload: expect.objectContaining({
                            user: expect.objectContaining({
                                isActive: true
                            })
                        })
                    })
                );
            });

            it('returns a null user in the payload if the user id does not exist', async () => {
                await client.doLogin(adminEmail, password);
                const response = await client.deactivateUser(unknownId);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'user not found',
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );
            });

            it('returns an error if a non-admin attempts to activate another user', async () => {
                await client.doLogin(requestor1Email, password);
                const response = await client.activateUser(requestorId2);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: expect.stringMatching(/^Error/),
                        payload: expect.objectContaining({
                            error: expect.stringMatching(/insufficient access/i)
                        })
                    })
                );
            });
        });
    });

    describe('/api/users/confirmemail/:token route', () => {
        let client: TestClient;
        let emailToken: string;

        beforeAll(() => {
            client = new TestClient();
        });

        afterEach(async () => {
            await TestUtils.dropUsers();
        });

        beforeEach(async () => {
            const user = await TestUtils.createTestUser({
                firstName: 'Oliver',
                lastName: 'Queen',
                email: 'oliver@desc.org',
                password: '123456',
                program: Program.SURVIVAL
            });

            emailToken = user.emailVerificationToken;
        });

        describe('PATCH request method', () => {
            it('confirms the email of a new user', async () => {
                const response = await client.confirmEmail(emailToken);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'email confirmed',
                        payload: expect.objectContaining({
                            user: expect.any(Object)
                        })
                    })
                );
            });

            it('returns a null user if the email token is not found', async () => {
                const unknownToken = '5fd3215e-834e-4d1c-ba27-9a668c4bb242';
                const response = await client.confirmEmail(unknownToken);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'email token not found',
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );
            });
        });
    });

    describe('/api/users/forgotpassword route', () => {
        let client: TestClient;

        beforeAll(() => {
            client = new TestClient();
        });

        afterEach(async () => {
            await TestUtils.dropUsers();
        });

        beforeEach(async () => {
            await TestUtils.createTestUser({
                firstName: 'Oliver',
                lastName: 'Queen',
                email: 'oliver@desc.org',
                password: '123456',
                program: Program.SURVIVAL
            });
        });

        describe('PATCH request method', () => {
            it('sends password reset email to user', async () => {
                const response = await client.forgotPassword('oliver@desc.org');

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'password reset instructions sent to user email',
                        payload: expect.objectContaining({
                            email: 'oliver@desc.org'
                        })
                    })
                );
            });

            it('returns a null user if the user (email) is not found', async () => {
                const response = await client.forgotPassword('unknownemail@desc.org');

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'user not found',
                        payload: expect.objectContaining({
                            email: null
                        })
                    })
                );
            });
        });
    });

    describe('/api/users/changepassword/:token route', () => {
        let client: TestClient;
        let resetToken: string;

        beforeAll(() => {
            client = new TestClient();
        });

        afterEach(async () => {
            await TestUtils.dropUsers();
        });

        beforeEach(async () => {
            await TestUtils.createTestUser({
                firstName: 'Oliver',
                lastName: 'Queen',
                email: 'oliver@desc.org',
                password: '123456',
                program: Program.SURVIVAL
            });

            const user = await userService.generatePasswordResetToken('oliver@desc.org');
            resetToken = user?.passwordResetToken as string;
        });

        describe('PATCH request method', () => {
            it(`changes a user's password if given a valid reset token`, async () => {
                const response = await client.changePassword(resetToken, 'supersecret');

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'password changed',
                        payload: expect.objectContaining({
                            user: expect.any(Object)
                        })
                    })
                );
            });

            it('does nothing if a user is not found to have the reset token', async () => {
                const unknownToken = '5fd3215e-834e-4d1c-ba27-9a668c4bb242';
                const response = await client.changePassword(unknownToken, 'nopasswordupdate');

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'password not changed',
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );
            });

            it('does nothing if the reset token has expired', async () => {
                const spy = jest
                    .spyOn(userService, 'changePassword')
                    .mockRejectedValue(new Error('reset token is expired'));

                const response = await client.changePassword(resetToken, 'supersecret');

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error with reset token',
                        payload: expect.objectContaining({
                            user: null
                        })
                    })
                );

                spy.mockReset();
                spy.mockRestore();
            });
        });
    });
});
