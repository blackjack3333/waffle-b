import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class DatabaseError extends ApiError {
    constructor(message?: string, data?: Record<string, unknown>, processCode?: number) {
        super(message || 'Database error', HttpStatusCode.INTERNAL_SERVER_ERROR, data, processCode);
    }
}
