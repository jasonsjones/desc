import { Container } from '@mui/material';
import SignInForm from '../../components/SigninForm';
import SingleColumnLayout from '../../layouts/SingleColumnLayout';

function Signin() {
    return (
        <SingleColumnLayout>
            <Container maxWidth="md">
                <SignInForm />
            </Container>
        </SingleColumnLayout>
    );
}

export default Signin;
