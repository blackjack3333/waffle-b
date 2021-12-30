import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class UnauthorizedError extends ApiError {
    constructor(message?: string, processCode?: number) {
        super(message || 'Not authorized', HttpStatusCode.UNAUTHORIZED, {}, processCode);
    }
}
