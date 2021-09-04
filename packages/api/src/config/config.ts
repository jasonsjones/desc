import pkgJSON from '../../package.json';

const { NODE_ENV: env = 'development', PORT: port = 3001 } = process.env;

const baseUrl = env === 'production' ? process.env.API_BASE_URL : 'http://localhost';

const config = {
    name: 'desc-api',
    version: pkgJSON.version,
    env,
    baseUrl,
    port
};

export default config;
