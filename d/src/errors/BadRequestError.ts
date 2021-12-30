import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class BadRequestError extends ApiError {
    constructor(message: string, data?: Record<string, unknown>, processCode?: number) {
        super(message || 'Bad request', HttpStatusCode.BAD_REQUEST, data, processCode);
    }
}
