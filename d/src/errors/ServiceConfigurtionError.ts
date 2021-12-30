import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class ServiceConfigurationError extends ApiError {
    constructor(message: string, processCode?: number) {
        super(`Configuration error: ${message}`, HttpStatusCode.INTERNAL_SERVER_ERROR, {}, processCode);
    }
}
