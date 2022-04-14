import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, cleanup } from '@testing-library/react';
import user from '@testing-library/user-event';
import SignupForm from './SignupForm';

const queryClient = new QueryClient();
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate
}));

function getComponentUnderTest() {
    return (
        <QueryClientProvider client={queryClient}>
            <SignupForm />
        </QueryClientProvider>
    );
}

describe('SignupForm', () => {
    afterEach(cleanup);

    it('renders an input for first name', () => {
        const { getByLabelText } = render(getComponentUnderTest());
        expect(getByLabelText('First Name')).toBeTruthy();
    });

    it('renders an input for last name on desktop', () => {
        const { getByTestId } = render(getComponentUnderTest());
        expect(getByTestId('last-name-desktop')).toBeTruthy();
    });

    it('renders an input for last name on mobile', () => {
        const { getByTestId } = render(getComponentUnderTest());
        expect(getByTestId('last-name-mobile')).toBeTruthy();
    });

    it('renders an input for email', () => {
        const { getByLabelText } = render(getComponentUnderTest());
        expect(getByLabelText('Your Email')).toBeTruthy();
    });

    it('renders an input to select a program', () => {
        const { getByLabelText } = render(getComponentUnderTest());
        expect(getByLabelText('Program')).toBeTruthy();
    });

    [
        'Housing First',
        'Integrated Services',
        'Survival Services',
        'Health Services',
        'Employment Services',
        'Research & Innovation'
    ].forEach((program) => {
        it(`renders an option for ${program} program`, () => {
            const { getAllByText } = render(getComponentUnderTest());
            expect(getAllByText(program)).toBeTruthy();
        });
    });

    it('renders an input for password', () => {
        const { getByLabelText } = render(getComponentUnderTest());
        expect(getByLabelText('Password')).toBeTruthy();
    });

    it('renders an input to confirm password', () => {
        const { getByLabelText } = render(getComponentUnderTest());
        expect(getByLabelText('Confirm Password')).toBeTruthy();
    });

    it('does not display message if password fields match', async () => {
        const { getByLabelText, queryByText } = render(getComponentUnderTest());
        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        await user.type(passwordInput, 'correctpassword');
        await user.type(confirmPasswordInput, 'correctpassword');
        expect(queryByText('Passwords do NOT match')).toBe(null);
    });

    it('displays a message when the password fields do not match', async () => {
        const { getByLabelText, getByText } = render(getComponentUnderTest());
        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        await user.type(passwordInput, 'correctpassword');
        await user.type(confirmPasswordInput, 'incorrectpassword');
        expect(getByText('Passwords do NOT match')).toBeTruthy();
    });
});
