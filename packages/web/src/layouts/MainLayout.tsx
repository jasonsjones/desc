import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

function MainLayout() {
    return (
        <Stack justifyContent="space-between" sx={{ height: '100vh' }}>
            <NavBar />
            <Box sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
            <Footer />
        </Stack>
    );
}

export default MainLayout;
