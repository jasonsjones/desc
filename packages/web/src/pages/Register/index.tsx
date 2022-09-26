import { Container } from '@mui/material';
import RegisterForm from '../../components/RegisterForm';
import SingleColumnLayout from '../../layouts/SingleColumnLayout';

function Register() {
    return (
        <SingleColumnLayout>
            <Container maxWidth="md">
                <RegisterForm />
            </Container>
        </SingleColumnLayout>
    );
}

export default Register;
