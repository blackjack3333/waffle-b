import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class UnprocessableEntityError extends ApiError {
    constructor(message: string, data?: Record<string, unknown>, processCode?: number) {
        super(message || 'Unprocessable Entity', HttpStatusCode.UNPROCESSABLE_ENTITY, data, processCode);
    }
}
