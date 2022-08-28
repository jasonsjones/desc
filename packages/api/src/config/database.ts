import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';

export async function createPostgresConnection(): Promise<void> {
    try {
        await AppDataSource.initialize();
        // else connect to heroku hosted postres
        // instance assigned to env var DATABASE_URL
    } catch (e) {
        console.error(e);
    }
}

export function closeConnection(): Promise<void> {
    // return getConnection(connectionName).close();
    return AppDataSource.destroy();
}

export function getDbConnection(): DataSource {
    // return getConnection(connectionName);
    return AppDataSource;
}

const TestAppData = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'desc-test',
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts']
});

const DevAppData = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'desc-dev',
    synchronize: true,
    logging: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts']
});

function getDataSource(): DataSource {
    switch (config.env) {
        case 'testing':
            return TestAppData;
        case 'development':
            return DevAppData;
        default:
            return TestAppData;
    }
}

export const AppDataSource = getDataSource();
