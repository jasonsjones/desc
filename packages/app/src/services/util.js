export const getBaseUrl = () => {
    if (process.env.NODE_ENV !== 'production') {
        return 'http://localhost:3001';
    } else {
        return 'https://desc-api.herokuapp.com';
    }
};

export const BASE_URL = `${getBaseUrl()}`;
