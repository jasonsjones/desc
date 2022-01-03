import { useMutation } from 'react-query';
import { AuthTokenResponse, Credentials } from '../common/apiResponseTypes';
import { login } from '../services/auth';

function useLogin(onSuccessCb: (data: AuthTokenResponse) => void) {
    return useMutation<AuthTokenResponse, Error, Credentials>(login, {
        onSuccess: onSuccessCb
    });
}

export default useLogin;
