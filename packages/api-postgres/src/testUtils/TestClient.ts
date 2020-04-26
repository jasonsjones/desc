import { Application } from 'express';
import request, { Test } from 'supertest';
import app from '../config/app';
import UserService from '../user/UserService';
import User, { Program } from '../entity/User';
import { UpdatableItemFields } from '../common/types';

class TestClient {
    private app: Application;

    constructor() {
        this.app = app;
    }

    public getIndexRoute(): Test {
        return request(this.app).get('/');
    }

    public getAPIRoute(): Test {
        return request(this.app).get('/api');
    }

    public createTestUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        program: Program;
    }): Promise<User> {
        const { firstName, lastName, email, password, program } = userData;
        return UserService.createUser(firstName, lastName, email, password, program);
    }

    public creatUserViaAPI(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        program: Program;
    }): Test {
        return request(this.app)
            .post('/api/users')
            .set('Content-Type', 'application/json')
            .send(userData);
    }

    public getAllUsers(): Test {
        return request(this.app)
            .get('/api/users')
            .set('Content-Type', 'application/json');
    }

    public getUser(id: string): Test {
        return request(this.app)
            .get(`/api/users/${id}`)
            .set('Content-Type', 'application/json');
    }

    public updateUser(
        id: string,
        updatedData: { firstName?: string; lastName?: string; email?: string }
    ): Test {
        return request(this.app)
            .patch(`/api/users/${id}`)
            .set('Content-Type', 'application/json')
            .send(updatedData);
    }

    public deleteUser(id: string): Test {
        return request(this.app)
            .delete(`/api/users/${id}`)
            .set('Content-Type', 'application/json');
    }

    public loginUser(email: string, password: string): Test {
        return request(this.app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email, password });
    }

    public createItem(itemData: any): Test {
        return request(this.app)
            .post('/api/items')
            .set('Content-Type', 'application/json')
            .send(itemData);
    }

    public getAllItems(): Test {
        return request(this.app)
            .get('/api/items')
            .set('Content-Type', 'application/json');
    }

    public getItem(id: string): Test {
        return request(this.app)
            .get(`/api/items/${id}`)
            .set('Content-Type', 'application/json');
    }

    public updateItem(id: string, updatedData: UpdatableItemFields): Test {
        return request(this.app)
            .patch(`/api/items/${id}`)
            .set('Content-Type', 'application/json')
            .send(updatedData);
    }

    public deleteItem(id: string): Test {
        return request(this.app)
            .delete(`/api/items/${id}`)
            .set('Content-Type', 'application/json');
    }

    public addNoteToItem(
        itemId: string,
        { body, authorId }: { body: string; authorId: string }
    ): Test {
        return request(this.app)
            .post(`/api/items/${itemId}/notes`)
            .set('Content-Type', 'application/json')
            .send({ body, authorId });
    }

    public deleteNoteFromItem(itemId: string, noteId: string): Test {
        return request(this.app)
            .delete(`/api/items/${itemId}/notes/${noteId}`)
            .set('Content-Type', 'application/json');
    }

    public createClientRequest(requestData: any): Test {
        return request(this.app)
            .post('/api/clientrequests')
            .set('Content-Type', 'application/json')
            .send(requestData);
    }

    public getAllClientRequests(): Test {
        return request(this.app)
            .get('/api/clientrequests')
            .set('Content-Type', 'application/json');
    }

    public getClientRequest(id: string): Test {
        return request(this.app)
            .get(`/api/clientrequests/${id}`)
            .set('Content-Type', 'application/json');
    }
}

export default TestClient;
