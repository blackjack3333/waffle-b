import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class RequestTimeoutError extends ApiError {
    constructor(message: string = 'Request Timeout', processCode?: number) {
        super(message, HttpStatusCode.REQUEST_TIMEOUT, {}, processCode);
    }
}
