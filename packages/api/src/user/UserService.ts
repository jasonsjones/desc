import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import DateUtils from '../common/DateUtils';
import { getEntityManager } from '../common/entityUtils';
import { UserRole } from '../common/types/enums';
import { UpdatableUserFields, UserFields } from '../common/types/user';
import User from '../entity/User';

class UserService {
    // reduce the hash salt length for tests to decrease the test run time
    private saltLength: number;

    constructor() {
        this.saltLength = process.env.NODE_ENV === 'testing' ? 4 : 12;
    }

    async createUser(userData: UserFields): Promise<User> {
        const em = getEntityManager();
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

        const user = em.create(User, data);
        user.emailVerificationToken = v4();
        return em.save(user);
    }

    async createAdminTestUser(userData: UserFields): Promise<User> {
        const em = getEntityManager();
        const { password } = userData;
        const hashedPassword = await bcrypt.hash(password, 4);
        const data: UserFields = {
            ...userData,
            password: hashedPassword,
            roles: [UserRole.ADMIN, UserRole.APPROVER]
        };

        const user = em.create(User, data);
        user.emailVerificationToken = v4();
        return em.save(user);
    }

    getAllUsers(): Promise<User[]> {
        return getEntityManager().find(User);
    }

    getUserById(id: string): Promise<User | undefined> {
        return getEntityManager().findOne(User, { where: { id } });
    }

    getUserByEmail(email: string): Promise<User | undefined> {
        return getEntityManager().findOne(User, { where: { email } });
    }

    async updateUser(id: string, data: UpdatableUserFields): Promise<User | undefined> {
        await getEntityManager().update(User, { id }, data);
        return this.getUserById(id);
    }

    async deleteUser(id: string): Promise<User | undefined> {
        const user = await this.getUserById(id);
        await getEntityManager().delete(User, { id });
        return user;
    }

    async setIsActive(id: string, isUserActive: boolean): Promise<User | undefined> {
        return this.updateUser(id, { isActive: isUserActive });
    }

    async confirmEmail(token: string): Promise<User | undefined> {
        const user = await getEntityManager().findOne(User, {
            where: { emailVerificationToken: token }
        });
        return this.updateUser(user?.id as string, {
            isEmailVerified: true,
            emailVerificationToken: ''
        });
    }

    async changePassword(token: string, newPassword: string): Promise<User | undefined> {
        const em = getEntityManager();
        const user = await em.findOne(User, { where: { passwordResetToken: token } });
        if (user) {
            const now = DateUtils.getCurrentDateTime();
            const isTokenExpired = now > user.passwordResetTokenExpiresAt;
            if (!isTokenExpired) {
                user.password = await bcrypt.hash(newPassword, this.saltLength);
                user.passwordResetToken = '';
                user.passwordResetTokenExpiresAt = now;
                user.passwordLastChangedAt = now;

                return em.save(user);
            } else {
                throw new Error('password reset token is expired');
            }
        } else {
            return undefined;
        }
    }

    async generatePasswordResetToken(email: string): Promise<User | undefined> {
        const user = await this.getUserByEmail(email);
        if (user) {
            const in2hrs = DateUtils.getDateMinutesFromNow(120);
            user.passwordResetToken = v4();
            user.passwordResetTokenExpiresAt = in2hrs;
            await getEntityManager().save(user);
        }
        return user;
    }

    private async getUserCount(): Promise<number> {
        const count = await getEntityManager().count(User);
        return count;
    }
}

export default new UserService();
