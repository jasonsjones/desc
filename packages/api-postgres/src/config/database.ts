import 'reflect-metadata';
import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import config from './config';

const envDbNameMap: Map<string, string> = new Map();
envDbNameMap.set('development', 'desc-dev');
envDbNameMap.set('testing', 'desc-test');
envDbNameMap.set('testingE2E', 'desc-test');

const dbName: string = envDbNameMap.get(config.env) as string;

export const createPostgresConnection = async (): Promise<void> => {
    try {
        if (config.env != 'production') {
            const connectionOptions = await getConnectionOptions(dbName);
            await createConnection({ ...connectionOptions, name: 'default' });
        }
        // else connect to heroku hosted postres
        // instance assigned to env var DATABASE_URL
    } catch (e) {
        console.error(e);
    }
};

export const closeConnection = (): Promise<void> => {
    return getConnection().close();
};
