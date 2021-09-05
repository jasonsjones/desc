import userService from '../UserService';
import User from '../../entity/User';
import TestUtils from '../../testUtils/TestUtilities';
import { Program } from '../../common/types/enums';
import DateUtils from '../../common/DateUtils';

const testUser = {
    firstName: 'John',
    lastName: 'Diggle',
    email: 'john@qc.com',
    password: '123456',
    program: Program.EMPLOYMENT
};

describe('User service integration tests', () => {
    afterEach(async () => {
        await TestUtils.dropUsers();
    });

    describe('createUser method', () => {
        it('creates a new user', async () => {
            const { firstName, lastName, email, password, program } = testUser;
            const result = await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });

            expect(result).toEqual(expect.any(User));
            expect(result.password).not.toEqual(testUser.password);
        });
    });

    describe('get[All]User* methods', () => {
        let userId: string;

        beforeEach(async () => {
            const { firstName, lastName, email, password, program } = testUser;
            const user = await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });
            userId = user.id;
        });

        it('getAllUsers() fetches all the users', async () => {
            const result = await userService.getAllUsers();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expect.any(User));
        });

        it('getUserById() fetches the user with the given id', async () => {
            const result = await userService.getUserById(userId);

            expect(result).toEqual(expect.any(User));
        });
    });

    describe('updateUser method', () => {
        let userId: string;

        beforeEach(async () => {
            const { firstName, lastName, email, password, program } = testUser;
            const user = await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });
            userId = user.id;
        });

        it('returns undefined if user cannot be found with given id', async () => {
            const result = await userService.updateUser('4157b081-e365-4984-aeac-c31aa255a474', {
                lastName: 'notfound'
            });
            expect(result).toBeUndefined();
        });

        it(`updates user's firstName`, async () => {
            const result = await userService.updateUser(userId, { firstName: 'Spartan' });
            expect(result?.firstName).toEqual('Spartan');
        });

        it(`updates user's lastName`, async () => {
            const result = await userService.updateUser(userId, { lastName: 'DC Character' });
            expect(result?.lastName).toEqual('DC Character');
        });

        it(`updates user's email`, async () => {
            const result = await userService.updateUser(userId, { email: 'spartan@qc.com' });
            expect(result?.email).toEqual('spartan@qc.com');
        });
    });

    describe('deleteUser method', () => {
        let userIdToDelete: string;

        beforeEach(async () => {
            await userService.createUser({
                firstName: 'Barry',
                lastName: 'Allen',
                email: 'barry@starlabs.com',
                password: 'test1234'
            });
            const { firstName, lastName, email, password, program } = testUser;
            const user = await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });
            userIdToDelete = user.id;
        });

        it('returns undefined if user cannot be found with given id', async () => {
            const result = await userService.deleteUser('4157b081-e365-4984-aeac-c31aa255a474');
            expect(result).toBeUndefined();
        });

        it(`deletes the user with the given id`, async () => {
            const result = await userService.deleteUser(userIdToDelete);
            expect(result?.id).toEqual(userIdToDelete);

            const users = await userService.getAllUsers();
            expect(users).toHaveLength(1);
        });
    });

    describe('setIsActive method', () => {
        let userIdToTest: string;

        beforeEach(async () => {
            await userService.createUser({
                firstName: 'Barry',
                lastName: 'Allen',
                email: 'barry@starlabs.com',
                password: 'test1234'
            });
            const { firstName, lastName, email, password, program } = testUser;
            const user = await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });
            userIdToTest = user.id;
        });

        it('returns undefined if user cannot be found with given id', async () => {
            const result = await userService.deleteUser('4157b081-e365-4984-aeac-c31aa255a474');
            expect(result).toBeUndefined();
        });

        it(`deactivates the user with the given id`, async () => {
            const result = await userService.setIsActive(userIdToTest, false);
            expect(result?.id).toEqual(userIdToTest);
            expect(result?.isActive).toBe(false);
        });

        it(`activates the user with the given id`, async () => {
            const result = await userService.setIsActive(userIdToTest, true);
            expect(result?.id).toEqual(userIdToTest);
            expect(result?.isActive).toBe(true);
        });
    });

    describe('confirmEmail method', () => {
        let emailToken: string;

        beforeEach(async () => {
            await userService.createUser({
                firstName: 'Barry',
                lastName: 'Allen',
                email: 'barry@starlabs.com',
                password: 'test1234'
            });
            const { firstName, lastName, email, password, program } = testUser;
            const user = await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });
            emailToken = user.emailVerificationToken;
        });

        it('returns undefined if user cannot be found with given token', async () => {
            const result = await userService.confirmEmail('4157b081-e365-4984-aeac-c31aa255a474');
            expect(result).toBeUndefined();
        });

        it(`confirms the user's email address`, async () => {
            const result = await userService.confirmEmail(emailToken);
            expect(result?.isEmailVerified).toBe(true);
            expect(result?.emailVerificationToken).toBe('');
        });
    });

    describe('generatePasswordResetToken method', () => {
        let userEmail: string;

        beforeEach(async () => {
            const { firstName, lastName, email, password, program } = testUser;
            const user = await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });

            userEmail = user.email;
        });

        it('returns undefined if user cannot be found with given email', async () => {
            const result = await userService.generatePasswordResetToken('unknown-user@test.com');
            expect(result).toBeUndefined();
        });

        it('generates random token and effective timestamp to use for password reset', async () => {
            const result = await userService.generatePasswordResetToken(userEmail);
            expect(result?.passwordResetToken.length).toBeGreaterThan(0);
            expect(result?.passwordResetTokenExpiresAt instanceof Date).toBeTruthy();
        });
    });

    describe('changePassword method', () => {
        let user: User;

        beforeEach(async () => {
            const { firstName, lastName, email, password, program } = testUser;
            await userService.createUser({
                firstName,
                lastName,
                email,
                password,
                program
            });

            user = (await userService.generatePasswordResetToken(email)) as User;
        });

        it('changes the password when provided a valid reset token', async () => {
            const oldPasswordHash = user.password;
            const result = await userService.changePassword(
                user.passwordResetToken,
                'secure-password'
            );

            expect(result?.password).not.toBe(oldPasswordHash);
            expect(result?.passwordResetToken).toBe('');
            expect(result?.passwordResetTokenExpiresAt).toBeTruthy();
            expect(result?.passwordLastChangedAt).toBeTruthy();
        });

        it('returns undefined when provided an invalid reset token', async () => {
            const result = await userService.changePassword(
                '4157b081-e365-4984-aeac-c31aa255a474',
                'secure-password'
            );

            expect(result).toBeUndefined();
        });

        it('throws an error if the reset token has expired', async () => {
            expect.assertions(1);

            // mock the current date time to be 3 hours in the future to force the password
            // reset token to be expired
            const spy = jest
                .spyOn(DateUtils, 'getCurrentDateTime')
                .mockImplementationOnce(() => new Date(Date.now() + 180 * 60 * 1000));

            try {
                await userService.changePassword(user.passwordResetToken, 'secure-password');
            } catch (e) {
                expect(e.message).toBe('password reset token is expired');
            } finally {
                spy.mockReset();
                spy.mockRestore();
            }
        });
    });
});
