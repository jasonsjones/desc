import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, cleanup, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import ForgotPasswordForm from './ForgotPasswordForm';
import * as UserDataService from '../../services/users';

jest.mock('../../services/users');

const queryClient = new QueryClient();
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate
}));

describe('Forgotpassword Form', () => {
    afterEach(cleanup);

    it('renders an input for email', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <ForgotPasswordForm />
                </QueryClientProvider>
            </MemoryRouter>
        );
        expect(getByLabelText('Your Email')).toBeTruthy();
    });

    it('displays message to user if the API call is successful', async () => {
        const json = Promise.resolve({
            success: true,
            message: 'password details sent to user',
            payload: { user: 'some@email.com' }
        });

        UserDataService.forgotPassword = jest.fn(() => json);

        const { getByLabelText, getByTestId, container } = render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <ForgotPasswordForm />
                </QueryClientProvider>
            </MemoryRouter>
        );
        const emailInput = getByLabelText('Your Email');
        await user.type(emailInput, 'some@email.com');
        user.click(getByTestId('submit-btn'));

        await waitFor(
            () => expect(getByTestId('success-message').textContent).toContain('Thank you.'),
            {
                container
            }
        );
        expect(UserDataService.forgotPassword).toHaveBeenCalledWith('some@email.com');
    });

    it('displays error message if the API call is unsuccessful', async () => {
        const json = Promise.resolve({
            success: false,
            message: 'user not found',
            payload: { user: null }
        });

        UserDataService.forgotPassword = jest.fn(() => json);

        const { getByLabelText, getByTestId, container } = render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <ForgotPasswordForm />
                </QueryClientProvider>
            </MemoryRouter>
        );
        const emailInput = getByLabelText('Your Email');
        await user.type(emailInput, 'unknown-user@email.com');
        user.click(getByTestId('submit-btn'));

        await waitFor(
            () =>
                expect(getByTestId('error-message').textContent).toContain('Something went wrong.'),
            { container }
        );
        expect(UserDataService.forgotPassword).toHaveBeenCalledWith('unknown-user@email.com');
    });
});
