import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, cleanup, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SigninForm from './SigninForm';
import AuthContext from '../../context/AuthContext';
import * as Auth from '../../services/auth';

jest.mock('../../services/auth');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate
}));

const queryClient = new QueryClient();

describe('SigninForm', () => {
    afterEach(cleanup);

    it('renders an input for email', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <SigninForm />{' '}
                </QueryClientProvider>
            </MemoryRouter>
        );
        expect(getByLabelText('Your Email')).toBeTruthy();
    });

    it('renders an input for password', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <SigninForm />
                </QueryClientProvider>
            </MemoryRouter>
        );
        expect(getByLabelText('Password')).toBeTruthy();
    });

    it('calls the login method from the auth service when Signin is clicked', async () => {
        Auth.login = jest
            .fn()
            .mockResolvedValue({ success: true, message: 'User authenticated', payload: {} });

        const { getByLabelText, getByText } = render(
            <MemoryRouter>
                <AuthContext.Provider value={{ login: () => {} }}>
                    <QueryClientProvider client={queryClient}>
                        <SigninForm />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </MemoryRouter>
        );
        const emailInput = getByLabelText('Your Email');
        const passwordInput = getByLabelText('Password');
        await user.type(emailInput, 'oliver@desc.org');
        await user.type(passwordInput, 'mySecret');
        user.click(getByText('Sign In'));

        await waitFor(() => {
            expect(Auth.login).toHaveBeenCalledTimes(1);
        });
    });
});
