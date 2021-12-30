import { AuthUrlTarget } from '../models/authUrl';

export interface GetAuthUrlQueryParamsRequest {
    appUserId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}

export interface GetAuthUrlRequest {
    params: {
        target: AuthUrlTarget;
    };
    query: GetAuthUrlQueryParamsRequest;
}
