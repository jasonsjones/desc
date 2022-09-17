import { Box, Container, Typography } from '@mui/material';

function Home() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h3" component="h1">
                    Welcome to the DESC Portal!!
                </Typography>
            </Box>
        </Container>
    );
}

export default Home;
