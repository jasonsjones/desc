export type User = {
    id: string;
    name: {
        first: string;
        last: string;
    };
    email: string;
    program: string;
    roles: string | string[];
};

export type Credentials = {
    email: string;
    password: string;
};

export interface BaseAPIResponse {
    success: boolean;
    message: string;
}

export interface AuthTokenResponse {
    message?: string;
    access_token?: string | null;
    user?: User | null;
}
