import { useQuery } from 'react-query';
import { AuthTokenResponse } from '../common/apiResponseTypes';
import { refreshToken } from '../services/auth';

export function useFetchToken(interval: number, onSuccessCb: (data: AuthTokenResponse) => void) {
    return useQuery('refreshAccessToken', refreshToken, {
        refetchInterval: 1000 * 60 * interval,
        onSuccess: onSuccessCb
    });
}
