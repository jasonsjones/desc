const { Client } = require('pg');
const debug = require('debug');

const log = debug('pdb:connection');

const dbName = 'desc-test';

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: dbName,
    password: 'postgres',
    port: 5432
});

exports.dropUsers = async function dropUsers() {
    await client.connect();
    log(`Connected to ${dbName}`);
    const res = await client.query('DELETE FROM public.user');
    log('User table dropped...');
    await client.end();
};
