import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class ServiceUnavailableError extends ApiError {
    constructor(message: string = 'Service unavailable', processCode?: number) {
        super(message, HttpStatusCode.SERVICE_UNAVAILABLE, {}, processCode);
    }
}
