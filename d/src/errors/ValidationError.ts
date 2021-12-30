import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export interface ValidationErrorField {
    type: string;
    message: string;
    field: string;
}

export class ValidationError extends ApiError {
    constructor(data: ValidationErrorField[] = null, processCode?: number) {
        super('Parameter validation error', HttpStatusCode.UNPROCESSABLE_ENTITY, { errors: data }, processCode);
    }
}
