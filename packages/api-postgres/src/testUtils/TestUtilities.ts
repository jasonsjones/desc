import { getConnection } from 'typeorm';
import User from '../entity/User';
import Item from '../entity/Item';
import Note from '../entity/Note';
import ClientRequest from '../entity/ClientRequest';
import { Program } from '../common/types';
import UserService from '../user/UserService';

class TestUtilities {
    public static createTestUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        program: Program;
    }): Promise<User> {
        const { firstName, lastName, email, password, program } = userData;
        return UserService.createUser({ firstName, lastName, email, password, program });
    }

    public static createAdminTestUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        program: Program;
    }): Promise<User> {
        const { firstName, lastName, email, password, program } = userData;
        return UserService.createAdminTestUser({ firstName, lastName, email, password, program });
    }

    public static async deleteUserByEmail(email: string): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(User)
            .where('email = :email', { email })
            .execute();
    }

    public static async dropItems(): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Item)
            .execute();
    }

    public static async dropUsers(): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(User)
            .execute();
    }

    public static async dropNotes(): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Note)
            .execute();
    }

    public static async dropClientRequests(): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(ClientRequest)
            .execute();
    }
}

export default TestUtilities;
