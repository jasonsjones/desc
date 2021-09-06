module.exports = [
    {
        name: 'desc-prod',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        logging: false,
        entities: ['dist/src/entity/**/*.js'],
        migrations: ['dist/src/migration/**/*.js'],
        subscribers: ['dist/src/subscriber/**/*.js']
    },
    {
        name: 'desc-dev',
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
        subscribers: ['src/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber'
        }
    },
    {
        name: 'desc-test',
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
        subscribers: ['src/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber'
        }
    }
];
