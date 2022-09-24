import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import AppProviders from './AppProviders';

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <AppProviders>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="login" element={<Login />} />
                        </Route>
                    </Routes>
                </AppProviders>
            </BrowserRouter>
        </div>
    );
}

export default App;
