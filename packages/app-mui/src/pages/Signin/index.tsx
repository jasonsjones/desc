import { Box, Container } from '@mui/material';
import SignInForm from '../../components/SigninForm';

function Signin() {
    return (
        <Container maxWidth="md">
            <Box mt={3.5}>
                <SignInForm />
            </Box>
        </Container>
    );
}

export default Signin;
