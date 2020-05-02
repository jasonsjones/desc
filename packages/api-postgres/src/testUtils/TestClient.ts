import request, { Test } from 'supertest';
import { UpdatableItemFields, Program } from '../common/types';
import BaseTestClient from './BaseTestClient';

class TestClient extends BaseTestClient {
    constructor() {
        super();
    }

    public getIndexRoute(): Test {
        return request(this.app).get('/');
    }

    public getAPIRoute(): Test {
        return request(this.app).get('/api');
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
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public getUser(id: string): Test {
        return request(this.app)
            .get(`/api/users/${id}`)
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public updateUser(
        id: string,
        updatedData: { firstName?: string; lastName?: string; email?: string }
    ): Test {
        return request(this.app)
            .patch(`/api/users/${id}`)
            .set('Content-Type', 'application/json')
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`)
            .send(updatedData);
    }

    public deleteUser(id: string): Test {
        return request(this.app)
            .delete(`/api/users/${id}`)
            .set('Content-Type', 'application/json')
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public loginUser(email: string, password: string): Test {
        return request(this.app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email, password });
    }

    public logoutUser(): void {
        this.clearTokens();
    }

    public createItem(itemData: any): Test {
        return request(this.app)
            .post('/api/items')
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`)
            .set('Content-Type', 'application/json')
            .send(itemData);
    }

    public getAllItems(): Test {
        return request(this.app)
            .get('/api/items')
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public getItem(id: string): Test {
        return request(this.app)
            .get(`/api/items/${id}`)
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public updateItem(id: string, updatedData: UpdatableItemFields): Test {
        return request(this.app)
            .patch(`/api/items/${id}`)
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`)
            .set('Content-Type', 'application/json')
            .send(updatedData);
    }

    public deleteItem(id: string): Test {
        return request(this.app)
            .delete(`/api/items/${id}`)
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public addNoteToItem(
        itemId: string,
        { body, authorId }: { body: string; authorId: string }
    ): Test {
        return request(this.app)
            .post(`/api/items/${itemId}/notes`)
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`)
            .set('Content-Type', 'application/json')
            .send({ body, authorId });
    }

    public deleteNoteFromItem(itemId: string, noteId: string): Test {
        return request(this.app)
            .delete(`/api/items/${itemId}/notes/${noteId}`)
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public createClientRequest(requestData: any): Test {
        return request(this.app)
            .post('/api/clientrequests')
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`)
            .set('Content-Type', 'application/json')
            .send(requestData);
    }

    public getAllClientRequests(): Test {
        return request(this.app)
            .get('/api/clientrequests')
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }

    public getClientRequest(id: string): Test {
        return request(this.app)
            .get(`/api/clientrequests/${id}`)
            .set('Cookie', [`qid=${this.refreshToken}`])
            .set('Authorization', `Bearer ${this.accessToken}`);
    }
}

export default TestClient;
