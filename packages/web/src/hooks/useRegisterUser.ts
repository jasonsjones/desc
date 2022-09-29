import { useMutation } from 'react-query';
import { RegisterUserResponse } from '../common/apiResponseTypes';
import { RegisterUserData } from '../common/userTypes';
import { useAuthContext } from '../contexts/AuthContext';
import { register } from '../services/user';

export function useRegisterUser(onSuccessCb: () => void, onErrorCb: () => void) {
    const authCtx = useAuthContext();

    return useMutation<RegisterUserResponse, Error, RegisterUserData>(register, {
        onSuccess: (data: RegisterUserResponse) => {
            if (data?.access_token) {
                authCtx.updateToken(data.access_token);
            }
            if (data?.user) {
                authCtx.updateContextUser(data.user);
            }

            if (onSuccessCb) {
                onSuccessCb();
            }
        },
        onError: onErrorCb
    });
}
