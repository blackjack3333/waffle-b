import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class DocumentNotFoundError extends ApiError {
    constructor(message: string = 'Document not found', processCode?: number) {
        super(message, HttpStatusCode.NOT_FOUND, null, processCode);
    }
}
