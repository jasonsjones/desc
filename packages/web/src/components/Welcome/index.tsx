import { Box, Grid, List, Typography } from '@mui/material';
import home from './coming_home.svg';
import WelcomeListItem from './WelcomeListItem';

function Welcome() {
    return (
        <>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h2" component="h1" fontWeight="regular">
                    Welcome to the DESC Portal!
                </Typography>
            </Box>
            <Grid container mt={2} spacing={6}>
                <Grid item>
                    <Typography variant="h4" component="h2" color="grey.800">
                        A place to meet the needs of DESC's clients
                    </Typography>
                    <List>
                        <WelcomeListItem>Request various items</WelcomeListItem>
                        <WelcomeListItem>Approve requests</WelcomeListItem>
                        <WelcomeListItem>Verify status of requests</WelcomeListItem>
                        <WelcomeListItem>Make notes on requests</WelcomeListItem>
                    </List>
                </Grid>
                <Grid item>
                    <img src={home} width="350" alt="coming home" />
                </Grid>
            </Grid>
        </>
    );
}

export default Welcome;
