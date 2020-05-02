import { Application } from 'express';
import request from 'supertest';
import app from '../config/app';

class BaseTestClient {
    protected app: Application;
    protected accessToken: string;
    protected refreshToken: string;

    constructor() {
        this.app = app;
    }

    public async doLogin(email: string, password: string): Promise<void> {
        this.clearTokens();
        const response = await request(this.app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email, password });

        this.accessToken = response.body.payload.accessToken;
        const rToken = this.getRefreshTokenFromHeaders(response.header['set-cookie']);
        this.refreshToken = rToken;
    }

    protected clearTokens(): void {
        this.accessToken = '';
        this.refreshToken = '';
    }

    protected getRefreshTokenFromHeaders(headers: string[]): string {
        let refreshToken = '';

        if (!headers || headers.length === 0) {
            return refreshToken;
        }

        const cookies = headers[0].split(';');
        const qid = cookies.find((cookie: string) => cookie.indexOf('qid=') === 0);
        if (qid) {
            refreshToken = qid.split('=')[1];
        }
        return refreshToken;
    }
}

export default BaseTestClient;
