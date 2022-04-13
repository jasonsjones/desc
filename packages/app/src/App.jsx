import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import Layout from './containers/Layout';
import Signup from './containers/Signup';
import Signin from './containers/Signin';
import UserProfile from './containers/UserProfile';
import Inbox from './containers/Inbox';
import RequestCreationPage from './components/RequestCreation/RequestCreationPage';
import Request from './containers/Request';
import Home from './components/Home/Home';
import ConfirmEmail from './containers/ConfirmEmail';
import ForgotPassword from './containers/ForgotPassword';
import ChangePassword from './containers/ChangePassword';
import PrivateRoute from './components/PrivateRoute';
import { reducer } from './reducers/reducer';

import './App.css';
import 'materialize-css/dist/css/materialize.css';
import { AuthProvider } from './context/AuthContext';

const store = createStore(reducer, applyMiddleware(thunk, logger));
const queryClient = new QueryClient();

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="signup" element={<Signup />} />
                                <Route path="signin" element={<Signin />} />
                                <Route path="forgotpassword" element={<ForgotPassword />} />
                                <Route path="confirmemail/:token" element={<ConfirmEmail />} />
                                <Route path="changepassword/:token" element={<ChangePassword />} />
                                <Route
                                    path="inbox"
                                    element={
                                        <PrivateRoute>
                                            <Inbox />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="createV1"
                                    element={
                                        <PrivateRoute>
                                            <RequestCreationPage />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="create"
                                    element={
                                        <PrivateRoute>
                                            <Request />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="profile"
                                    element={
                                        <PrivateRoute>
                                            <UserProfile />
                                        </PrivateRoute>
                                    }
                                />
                            </Route>
                        </Routes>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
