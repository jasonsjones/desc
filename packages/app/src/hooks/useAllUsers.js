import { useQuery } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { getUsers } from '../services/users';

function useAllUsers(onSuccess) {
    const { token } = useAuthContext();
    return useQuery(['users', { token }], getUsers, { onSuccess });
}

export default useAllUsers;
