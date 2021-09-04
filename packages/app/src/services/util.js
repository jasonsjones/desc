export const getBaseUrl = () => {
    if (process.env.NODE_ENV !== 'production') {
        return 'http://localhost:3001';
    } else {
        return process.env.REACT_APP_API_BASE_URL;
    }
};

export const BASE_URL = `${getBaseUrl()}`;
