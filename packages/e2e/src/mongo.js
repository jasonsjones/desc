const mongoose = require('mongoose');
const debug = require('debug');

const log = debug('mdb:connection');

module.exports = function(config) {
    const getDbName = () => {
        return config.env !== 'testing' ? config.db.name.dev : config.db.name.test;
    };

    const buildConnectionString = () => {
        if (config.db.options) {
            return `${config.db.baseUri}/${getDbName()}?${config.db.options}`;
        }
        return `${config.db.baseUri}/${getDbName()}`;
    };

    log('setting up mongodb...');
    mongoose.Promise = global.Promise;
    mongoose.connect(buildConnectionString(), {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let db = mongoose.connection;

    db.once('open', () => {
        log(`Connected to ${getDbName()}`);
    });

    db.on('error', console.error.bind(console, 'connection error'));
    db.on('disconnected', () => {
        log(`Mongoose disconnected`);
    });

    process.on('SIGINT', () => {
        db.close(() => {
            log('Mongoose default connection closed via app termination');
            process.exit(0);
        });
    });

    process.once('SIGUSR2', () => {
        db.close(() => {
            log('Mongoose default connection closed via nodemon restart');
            process.kill(process.pid, 'SIGUSR2');
        });
    });
    return db;
};
