import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class HttpError extends ApiError {
    constructor(message: string, code: number = HttpStatusCode.INTERNAL_SERVER_ERROR, processCode?: number) {
        super(`Configuration error: ${message}`, code, {}, processCode);
    }
}
