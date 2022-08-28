import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import DateUtils from '../common/DateUtils';
import { getUserRepository } from '../common/entityUtils';
import { UserRole } from '../common/types/enums';
import { UpdatableUserFields, UserFields } from '../common/types/user';
import User from '../entity/User';

class UserService {
    private saltLength: number;

    constructor() {
        // reduce the hash salt length for tests to decrease the test run time
        this.saltLength = process.env.NODE_ENV === 'testing' ? 4 : 12;
    }

    async createUser(userData: UserFields): Promise<User> {
        const { password } = userData;

        const hashedPassword = await bcrypt.hash(password, this.saltLength);
        let data: UserFields = { ...userData, password: hashedPassword };

        // for dev purposes, let's make the first user created an 'admin' & 'approver';
        // all subsequent users will default to a 'requestor'
        if (
            (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testingE2E') &&
            (await this.getUserCount()) === 0
        ) {
            data = { ...data, roles: [UserRole.ADMIN, UserRole.APPROVER] };
        }

        const user = getUserRepository().create(data);
        user.emailVerificationToken = v4();
        return getUserRepository().save(user);
    }

    async createAdminTestUser(userData: UserFields): Promise<User> {
        const { password } = userData;
        const hashedPassword = await bcrypt.hash(password, 4);
        const data: UserFields = {
            ...userData,
            password: hashedPassword,
            roles: [UserRole.ADMIN, UserRole.APPROVER]
        };

        const user = getUserRepository().create(data);
        user.emailVerificationToken = v4();
        return getUserRepository().save(user);
    }

    getAllUsers(): Promise<User[]> {
        return getUserRepository().find({});
    }

    getUserById(id: string): Promise<User | null> {
        if (!id) {
            throw new Error('Id is required');
        }
        return getUserRepository().findOne({ where: { id } });
    }

    getUserByEmail(email: string): Promise<User | null> {
        return getUserRepository().findOne({ where: { email } });
    }

    async updateUser(id: string, data: UpdatableUserFields): Promise<User | null> {
        await getUserRepository().update({ id }, data);
        return this.getUserById(id);
    }

    async deleteUser(id: string): Promise<User | null> {
        const user = await this.getUserById(id);
        await getUserRepository().delete({ id });
        return user;
    }

    async setIsActive(id: string, isUserActive: boolean): Promise<User | null> {
        return this.updateUser(id, { isActive: isUserActive });
    }

    async confirmEmail(token: string): Promise<User | null> {
        const user = await getUserRepository().findOne({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            return null;
        }

        return this.updateUser(user?.id as string, {
            isEmailVerified: true,
            emailVerificationToken: ''
        });
    }

    async changePassword(token: string, newPassword: string): Promise<User | null> {
        const user = await getUserRepository().findOne({ where: { passwordResetToken: token } });
        if (user) {
            const now = DateUtils.getCurrentDateTime();
            const isTokenExpired = now > user.passwordResetTokenExpiresAt;
            if (!isTokenExpired) {
                user.password = await bcrypt.hash(newPassword, this.saltLength);
                user.passwordResetToken = '';
                user.passwordResetTokenExpiresAt = now;
                user.passwordLastChangedAt = now;

                return getUserRepository().save(user);
            } else {
                throw new Error('password reset token is expired');
            }
        } else {
            return null;
        }
    }

    async generatePasswordResetToken(email: string): Promise<User | null> {
        const user = await this.getUserByEmail(email);
        if (user) {
            const in2hrs = DateUtils.getDateMinutesFromNow(120);
            user.passwordResetToken = v4();
            user.passwordResetTokenExpiresAt = in2hrs;
            await getUserRepository().save(user);
        }
        return user;
    }

    private async getUserCount(): Promise<number> {
        const count = await getUserRepository().count();
        return count;
    }
}

export default new UserService();
