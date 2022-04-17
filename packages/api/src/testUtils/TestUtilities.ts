import User from '../entity/User';
import Item from '../entity/Item';
import Note from '../entity/Note';
import ClientRequest from '../entity/ClientRequest';
import { Program } from '../common/types/enums';
import userService from '../user/UserService';
import { getDbConnection } from '../config/database';

class TestUtilities {
    public static createTestUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        program: Program;
    }): Promise<User> {
        const { firstName, lastName, email, password, program } = userData;
        return userService.createUser({ firstName, lastName, email, password, program });
    }

    public static createAdminTestUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        program: Program;
    }): Promise<User> {
        const { firstName, lastName, email, password, program } = userData;
        return userService.createAdminTestUser({ firstName, lastName, email, password, program });
    }

    public static async deleteUserByEmail(email: string): Promise<void> {
        await getDbConnection()
            .createQueryBuilder()
            .delete()
            .from(User)
            .where('email = :email', { email })
            .execute();
    }

    public static async dropItems(): Promise<void> {
        await getDbConnection().createQueryBuilder().delete().from(Item).execute();
    }

    public static async dropUsers(): Promise<void> {
        await getDbConnection().createQueryBuilder().delete().from(User).execute();
    }

    public static async dropNotes(): Promise<void> {
        await getDbConnection().createQueryBuilder().delete().from(Note).execute();
    }

    public static async dropClientRequests(): Promise<void> {
        await getDbConnection().createQueryBuilder().delete().from(ClientRequest).execute();
    }
}

export default TestUtilities;
