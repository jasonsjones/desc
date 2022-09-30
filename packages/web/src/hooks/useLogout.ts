import { useMutation } from 'react-query';
import { useAuthContext } from '../contexts/AuthContext';
import { logout as logoutMutationFn } from '../services/auth';

export function useLogout() {
    const { logout } = useAuthContext();

    return useMutation(logoutMutationFn, {
        onSuccess: () => {
            logout();
        }
    });
}
