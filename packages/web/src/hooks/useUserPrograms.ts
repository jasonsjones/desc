import { useQuery } from 'react-query';
import { fetchPrograms } from '../services/user';

export function useUserPrograms() {
    return useQuery('fetchPrograms', fetchPrograms, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        cacheTime: 30 * 60 * 1000
    });
}
