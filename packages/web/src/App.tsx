import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Signin from './pages/Signin';
import AppProviders from './AppProviders';

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <AppProviders>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="signin" element={<Signin />} />
                        </Route>
                    </Routes>
                </AppProviders>
            </BrowserRouter>
        </div>
    );
}

export default App;
