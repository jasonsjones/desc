export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    program: string;
    roles: string | string[];
};

export type Credentials = {
    email: string;
    password: string;
};

export interface AuthTokenResponse {
    access_token: string | null;
    user?: User | null;
    message?: string;
}
