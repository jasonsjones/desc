import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import User from '../entity/User';
import { getRepository } from 'typeorm';
import { UserFields, UpdatableUserFields, UserRole } from '../common/types';

export default class UserService {
    static async createUser(userData: UserFields): Promise<User> {
        const { password } = userData;

        // reduce the hash salt length for tests to decrease the test run time
        const saltLength = process.env.NODE_ENV === 'testing' ? 4 : 12;
        const hashedPassword = await bcrypt.hash(password, saltLength);
        let data: UserFields = { ...userData, password: hashedPassword };

        // for dev purposes, let's make the first user created an 'admin' & 'approver';
        // all subsequent users will default to a 'requestor'
        if (
            (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testingE2E') &&
            (await UserService.getUserCount()) === 0
        ) {
            data = { ...data, roles: [UserRole.ADMIN, UserRole.APPROVER] };
        }

        const user = User.create(data);
        user.emailVerificationToken = v4();
        return user.save();
    }

    static async createAdminTestUser(userData: UserFields): Promise<User> {
        const { password } = userData;
        const hashedPassword = await bcrypt.hash(password, 4);
        let data: UserFields = {
            ...userData,
            password: hashedPassword,
            roles: [UserRole.ADMIN, UserRole.APPROVER]
        };

        const user = User.create(data);
        user.emailVerificationToken = v4();
        return user.save();
    }

    static getAllUsers(): Promise<User[]> {
        return User.find();
    }

    static getUserById(id: string): Promise<User | undefined> {
        return User.findOne({ where: { id } });
    }

    static getUserByEmail(email: string): Promise<User | undefined> {
        return User.findOne({ where: { email } });
    }

    static async updateUser(id: string, data: UpdatableUserFields): Promise<User | undefined> {
        await User.update({ id }, data);
        return UserService.getUserById(id);
    }

    static async deleteUser(id: string): Promise<User | undefined> {
        const user = await UserService.getUserById(id);
        await User.delete({ id });
        return user;
    }

    private static async getUserCount(): Promise<number> {
        const count = await getRepository(User).createQueryBuilder('user').getCount();
        return count;
    }
}
