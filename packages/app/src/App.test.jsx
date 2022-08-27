import React from 'react';
import '@testing-library/jest-dom';
import { render, cleanup, screen } from '@testing-library/react';
import App from './App';

jest.mock('./hooks/useRefreshAccessToken', () => ({
    __esModule: true,
    default: () => jest.fn()
}));

afterEach(cleanup);

it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/welcome to the desc portal/i)).toBeInTheDocument();
});
