import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Signin from './pages/Signin';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="signin" element={<Signin />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
