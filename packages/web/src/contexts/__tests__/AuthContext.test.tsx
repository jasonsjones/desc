import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuthContext } from '../AuthContext';

jest.mock('../../hooks', () => ({
    __esModule: true,
    useFetchToken: jest.fn().mockImplementationOnce(() => ({
        isLoading: false
    })) // first call
}));

const TEST_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkE2MjM5MDIyfQ.SflKxwR36POk6yJV_adQssw5c';

const user = {
    id: 'fa5b55d2-476d-4c7c-875b-a627628035cc',
    firstName: 'Test',
    lastName: 'User',
    email: 'test-user@example.com',
    program: 'Health_Services',
    roles: ['Requestor']
};

function wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}

function AuthConsumer(): JSX.Element {
    const { token, login, logout } = useAuthContext();

    return (
        <>
            <p>Token value: {token}</p>
            <button onClick={() => login(user, TEST_TOKEN)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </>
    );
}

describe('AuthContext', () => {
    it('initializes with default token value', async () => {
        render(<AuthConsumer />, { wrapper });
        expect(await screen.findByText(/^Token/)).toHaveTextContent('Token value:');
    });
});
