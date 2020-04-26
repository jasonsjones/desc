import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
import { passportConfig } from './passport';
import IndexRouter from '../index/IndexRouter';
import AuthRouter from '../auth/AuthRouter';
import UserRouter from '../user/UserRouter';
import AuthController from '../auth/AuthController';
import ItemRouter from '../item/ItemRouter';
import ClientRequestRouter from '../clientRequest/ClientRequestRouter';
import config from './config';

const app = express();

passportConfig(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:4200'], credentials: true }));
app.use(passport.initialize());
if (config.env === 'development') {
    app.use(morgan('dev'));
} else if (config.env == 'production') {
    app.use(morgan('combined'));
}

app.use(AuthController.processToken);

app.use('/', IndexRouter.getRouter());
app.use('/api/auth', AuthRouter.getRouter(passport));
app.use('/api/users', UserRouter.getRouter());
app.use('/api/items', ItemRouter.getRouter());
app.use('/api/clientrequests', ClientRequestRouter.getRouter());

export default app;
