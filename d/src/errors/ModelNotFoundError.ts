import { ApiError } from './ApiError';

import { HttpStatusCode } from '../interfaces/libs/http';

export class ModelNotFoundError extends ApiError {
    constructor(resource: string, id: string, data: Record<string, unknown> = null, processCode?: number) {
        super(`The requested model ${resource} ${id} could not be found.`, HttpStatusCode.NOT_FOUND, data, processCode);
    }
}
