import { useQuery } from 'react-query';
import { AuthTokenResponse } from '../common/apiResponseTypes';
import { refreshToken } from '../services/auth';

function useRefreshAccessToken(interval: number, onSuccessCb: (data: AuthTokenResponse) => void) {
    return useQuery('refreshAccessToken', refreshToken, {
        refetchInterval: 1000 * 60 * interval,
        onSuccess: onSuccessCb
    });
}

export default useRefreshAccessToken;
