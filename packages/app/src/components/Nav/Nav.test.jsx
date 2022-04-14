import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, cleanup, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import Nav from './Nav';
import AuthContext from '../../context/AuthContext';
import * as Auth from '../../services/auth';

jest.mock('../../services/auth');

const contextUser = {
    name: {
        first: 'Oliver',
        last: 'Queen'
    },
    email: 'ollie@qc.com'
};

const token = 'eythisisthetokenoftheauthuser1234';
const queryClient = new QueryClient();

const renderWithRouterAndContext = () => {
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ contextUser, token, logout: () => {} }}>
                <Router>
                    <Nav />
                </Router>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

const renderWithRouter = () => {
    return render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <Nav />
            </Router>
        </QueryClientProvider>
    );
};

describe('NavBar', () => {
    afterEach(cleanup);

    it('renders the brand logo', () => {
        const { getByText } = renderWithRouter();
        expect(getByText(/DESC/)).toBeTruthy();
    });

    it('renders two Sign Up links (desktop/mobile)', () => {
        const { getAllByText } = renderWithRouter();
        expect(getAllByText('Sign Up')).toHaveLength(2);
    });

    it('renders two Sign In links (desktop/mobile)', () => {
        const { getAllByText } = renderWithRouter();
        expect(getAllByText('Sign In')).toHaveLength(2);
    });

    it('sign in link is not present if user is authenticated', () => {
        const { queryByText } = renderWithRouterAndContext();
        expect(queryByText('Sign In')).toBeNull();
    });

    it('sign up link is not present if user is authenticated', () => {
        const { queryByText } = renderWithRouterAndContext();
        expect(queryByText('Sign Up')).toBeNull();
    });

    it('renders the users first and last name when logged in', () => {
        const { getByText } = renderWithRouterAndContext();
        expect(getByText(`${contextUser.name.first} ${contextUser.name.last}`)).toBeTruthy();
    });

    it('renders two links to create requests when logged in (desktop/mobile)', () => {
        const { getAllByText } = renderWithRouterAndContext();
        expect(getAllByText('Create Request')).toHaveLength(2);
    });

    it('renders two links to view requests when logged in (desktop/mobile)', () => {
        const { getAllByText } = renderWithRouterAndContext();
        expect(getAllByText('View Requests')).toHaveLength(2);
    });

    it('renders a dropdown with two logout options when logged in (desktop/mobile)', () => {
        const { getAllByText } = renderWithRouterAndContext();
        expect(getAllByText('Logout')).toHaveLength(2);
    });

    it('calls the logout method from the auth service when Logout is clicked', async () => {
        Auth.logout = jest.fn().mockResolvedValue({ success: true, message: 'User logged out' });
        const { getAllByText } = renderWithRouterAndContext();
        const desktopLogout = getAllByText('Logout')[0];
        user.click(desktopLogout);

        await waitFor(() => {
            expect(Auth.logout).toHaveBeenCalledTimes(1);
        });
    });
});
