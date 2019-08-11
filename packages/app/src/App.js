import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './containers/Layout';
import Signup from './containers/Signup';
import Signin from './containers/Signin';
import Home from './components/Home';

import './App.css';
import 'materialize-css/dist/css/materialize.css';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/signin" component={Signin} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default App;