require('dotenv/config');

const {
    NODE_ENV: env = 'development',
    PORT: port = 3000,
    JWT_SECRET: token_secret = 'defaulttokensecret12345',
    DB_USER: dbUser,
    DB_PASSWORD: dbPassword,
    DB_URL: dbUrl,
    DB_NAME_DEV: dbNameDev,
    DB_NAME_TEST: dbNameTest,
    DB_HOST1: dbHost1,
    DB_HOST2: dbHost2,
    DB_HOST3: dbHost3,
    DB_OPTIONS: dbOptions
} = process.env;

//DB_URL_DEV = 'mongodb://emily:iM7jk7Xz@ds031847.mlab.com:31847/desc-simplify-api-dev',

const generateDbBaseUri = () => {
    if (dbHost1 && dbHost2 && dbHost3) {
        return `mongodb://${dbUser}:${dbPassword}@${dbHost1},${dbHost2},${dbHost3}`;
    }
    if (dbUrl) {
        return `mongodb://${dbUser}:${dbPassword}@${dbUrl}`;
    }
    return `mongodb://localhost:27017`;
};

const db = {
    baseUri: generateDbBaseUri(),
    options: dbOptions,
    name: {
        dev: dbNameDev,
        test: dbNameTest
    }
};

const config = {
    name: 'desc-simplify-api',
    env,
    port,
    token_secret,
    db
};

module.exports = config;
