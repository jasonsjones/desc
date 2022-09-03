declare namespace Express {
    export interface User {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        refreshTokenVersion: number;
    }
}
