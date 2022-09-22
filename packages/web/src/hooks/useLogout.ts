import { useMutation } from 'react-query';
import { useAuthContext } from '../contexts/AuthContext';
import { doLogout } from '../services/auth';

export function useLogout() {
    const { logout } = useAuthContext();

    return useMutation(doLogout, {
        onSuccess: (data) => {
            console.log(data);
            logout();
        }
    });
}
