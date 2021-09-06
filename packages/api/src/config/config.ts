import pkgJSON from '../../package.json';
import { Environment } from '../common/types/enums';

const { NODE_ENV: env = Environment.DEVELOPMENT, PORT: port = 3001 } = process.env;

const baseUrl = env === Environment.PRODUCTION ? process.env.API_BASE_URL : 'http://localhost';

const config = {
    name: 'desc-api',
    version: pkgJSON.version,
    env,
    baseUrl,
    port
};

export default config;
