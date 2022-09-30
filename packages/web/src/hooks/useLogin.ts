import { useMutation } from 'react-query';
import { AuthTokenResponse, Credentials } from '../common/apiResponseTypes';
import { useAuthContext } from '../contexts/AuthContext';
import { login } from '../services/auth';

export function useLogin(onSuccessCb: () => void, onErrorCb: () => void) {
    const authCtx = useAuthContext();

    return useMutation<AuthTokenResponse, Error, Credentials>(login, {
        onSuccess: (data) => {
            if (data?.access_token && data?.user) {
                const { user, access_token: token } = data;
                authCtx.login(user, token);
                if (onSuccessCb) {
                    onSuccessCb();
                }
            }
        },
        onError: onErrorCb
    });
}
