import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class AccessDeniedError extends ApiError {
    constructor(message?: string, data?: Record<string, unknown>, processCode?: number) {
        super(message || 'Forbidden', HttpStatusCode.FORBIDDEN, data, processCode);
    }
}
