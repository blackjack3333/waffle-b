import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class InternalServerError extends ApiError {
    constructor(message: string = 'Internal server error', processCode?: number) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, {}, processCode);
    }
}
