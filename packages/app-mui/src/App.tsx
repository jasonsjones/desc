import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Signin from './pages/Signin';

const queryClient = new QueryClient();

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="signin" element={<Signin />} />
                        </Route>
                    </Routes>
                </QueryClientProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
