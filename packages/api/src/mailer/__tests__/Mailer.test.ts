import mailer from '../Mailer';
import User from '../../entity/User';

describe('Mailer', () => {
    it('sends default verification email', async () => {
        const testUser = new User();
        testUser.emailVerificationToken = 'randomtokenstringhere';
        const email = await mailer.sendVerificationEmail('http://localhost:3001', testUser);

        expect(email).toEqual(
            expect.objectContaining({
                envelope: expect.any(Object),
                messageId: expect.any(String)
            })
        );
    });

    it('sends password reset email', async () => {
        const testUser = new User();
        testUser.passwordResetToken = 'randomtokenstringhere';
        const email = await mailer.sendPasswordResetEmail('http://localhost:3001', testUser);

        expect(email).toEqual(
            expect.objectContaining({
                envelope: expect.any(Object),
                messageId: expect.any(String)
            })
        );
    });
});
