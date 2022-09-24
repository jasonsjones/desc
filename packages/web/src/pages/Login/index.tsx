import { Container } from '@mui/material';
import LoginForm from '../../components/LoginForm';
import SingleColumnLayout from '../../layouts/SingleColumnLayout';

function Login() {
    return (
        <SingleColumnLayout>
            <Container maxWidth="md">
                <LoginForm />
            </Container>
        </SingleColumnLayout>
    );
}

export default Login;
