import { Request, Response } from 'express';
import authController from '../AuthController';

describe('Auth Controller unit tests', () => {
    describe('login()', () => {
        it.todo('returns context user and access token on success');
    });

    describe('getRefreshToken()', () => {
        it('sends empty access token if a refresh token is not provided', async () => {
            const req = {
                cookies: {}
            } as Request;
            const res = {} as Response;
            res.json = jest.fn();

            await authController.getRefreshToken(req, res);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'new access token requested.',
                    payload: {
                        accessToken: ''
                    }
                })
            );
        });
    });
});
