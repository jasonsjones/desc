import 'reflect-metadata';
import { Connection, createConnection, getConnection } from 'typeorm';
import { DbName, Environment } from '../common/types/enums';
import config from './config';

const connectionName = getDbNameFromEnv(config.env as Environment);

export async function createPostgresConnection(): Promise<void> {
    try {
        await createConnection(connectionName);
    } catch (e) {
        console.error(e);
    }
}

export function closeConnection(): Promise<void> {
    return getConnection(connectionName).close();
}

export function getDbConnection(): Connection {
    return getConnection(connectionName);
}

function getDbNameFromEnv(env: Environment): DbName {
    const envDbNameMap: Map<Environment, DbName> = new Map();
    envDbNameMap.set(Environment.DEVELOPMENT, DbName.DEVELOPMENT);
    envDbNameMap.set(Environment.TESTING, DbName.TESTING);
    envDbNameMap.set(Environment.TESTING_E2E, DbName.TESTING);
    envDbNameMap.set(Environment.PRODUCTION, DbName.PRODUCTION);
    return envDbNameMap.get(env) || DbName.DEVELOPMENT;
}
