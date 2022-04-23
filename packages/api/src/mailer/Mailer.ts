import nodemailer from 'nodemailer';
import config from '../config/config';
import User from '../entity/User';
import {
    getEmailVerificatonTemplateText,
    getEmailVerificatonTemplateHTML
} from './templates/emailVerificaton';
import {
    getPasswordResetTemplateHTML,
    getPasswordResetTemplateText
} from './templates/passwordReset';

interface MailOptions {
    port?: number;
    jsonTransport?: boolean;
}

class Mailer {
    async sendVerificationEmail(baseUrl: string, user: User): Promise<any> {
        const transporter = nodemailer.createTransport(this.getMailOptions());
        const verifiedTransporter =
            config.env === 'testingE2E' || config.env === 'testing'
                ? true
                : await transporter.verify();

        if (verifiedTransporter) {
            return transporter.sendMail({
                from: 'portal-admin@desc.org',
                to: user.email,
                subject: 'DESC In-Kind Portal Email Verification',
                text: getEmailVerificatonTemplateText(baseUrl, user.emailVerificationToken),
                html: getEmailVerificatonTemplateHTML(baseUrl, user.emailVerificationToken)
            });
        }
    }

    async sendPasswordResetEmail(baseUrl: string, user: User): Promise<any> {
        const transporter = nodemailer.createTransport(this.getMailOptions());
        const verifiedTransporter =
            config.env === 'testingE2E' || config.env === 'testing'
                ? true
                : await transporter.verify();

        if (verifiedTransporter) {
            return transporter.sendMail({
                from: 'portal-admin@desc.org',
                to: user.email,
                subject: 'DESC In-Kind Password Reset',
                text: getPasswordResetTemplateText(baseUrl, user.passwordResetToken),
                html: getPasswordResetTemplateHTML(baseUrl, user.passwordResetToken)
            });
        }
    }

    private getMailOptions(): MailOptions {
        let mailOpts = {};
        switch (config.env) {
            case 'production':
                // add mail options to connect to outgoing email account
                // when one is identified
                break;
            case 'development':
                // configure for local 'mailhog' smtp server
                mailOpts = {
                    port: 1025
                };
                break;

            case 'testing':
            case 'testingE2E':
                mailOpts = {
                    jsonTransport: true
                };
                break;
            default:
                break;
        }
        return mailOpts;
    }
}

export default new Mailer();
