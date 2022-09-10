import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('ClientRequestsController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('does NOT blow up', () => {
        expect(true).toBe(true);
    });

    describe('POST /client-requests', () => {
        it.todo('creates a new client request');
    });

    describe('GET /client-requests', () => {
        it.todo('returns all the client request');
    });

    describe('GET /client-requests/:id', () => {
        it.todo('returns a single client request with the given id');
    });

    describe('PATCH /client-requests/:id', () => {
        it.todo('updates the client request with the given id');
    });

    describe('DELETE /client-requests/:id', () => {
        it.todo('deletes the client request with the given id');
    });
});
