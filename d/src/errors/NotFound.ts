import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class NotFoundError extends ApiError {
    constructor(message: string = 'Not found', processCode?: number) {
        super(message, HttpStatusCode.NOT_FOUND, {}, processCode);
    }
}
