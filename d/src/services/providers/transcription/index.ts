import { isEmpty } from 'lodash';

import configService from '../../config';

import { HttpService } from '../../../libs/http';

import {
    GetTranscriptionByUserIdAndLinkRequest,
    GetTranscriptionByUserIdAndLinkResponse
} from '../../../interfaces/services/providers/transcription';
import {
    HttpMethod,
    HttpServiceResponse,
    HttpServiceResponseResult,
    HttpStatusCode,
    MakeApiCallOps
} from '../../../interfaces/libs/http';
import { ServiceUnavailableError } from '../../../errors/ServiceUnavailableError';
import { UnprocessableEntityError } from '../../../errors/UnprocessableEntityError';
import { FileLang } from '../../../interfaces/models/file';

class TranscriptionProvider {
    private readonly logPrefix: string = 'Transcription API:';

    private readonly requestTimeout: number = configService.get('app.integrationPointsTimeout');

    private readonly transcriptionApiHost: string = configService.get('transcription.host');

    private readonly transcriptionApiPort: number = configService.get('transcription.port');

    private readonly httpService: HttpService;

    constructor() {
        this.httpService = new HttpService(console, configService.get('transcription.httpProtocol'));
    }

    async getTranscriptionByUserIdAndLink(userId: string, link: string, lang: FileLang): Promise<string> {
        const path: string = `${configService.get('transcription.getTranscriptionPath')}/${lang}`;
        const requestData: GetTranscriptionByUserIdAndLinkRequest = { user_id: userId, file_url: link };
        const ops: MakeApiCallOps = { data: requestData, method: HttpMethod.POST };

        const { transcription, error }: GetTranscriptionByUserIdAndLinkResponse = await this.getResource(path, ops);
        if (error) {
            throw new UnprocessableEntityError(`Error during transcription: ${error}`);
        }

        return transcription;
    }

    private async getResource<T>(path: string, ops: MakeApiCallOps): Promise<T> | never {
        const [error, response]: HttpServiceResponse = await this.makeApiCall(path, ops);
        if (error || response?.statusCode !== HttpStatusCode.OK) {
            const errorResponse: HttpServiceResponseResult = error || response;

            return this.processResponseError(errorResponse || response, path);
        }

        return response.data;
    }

    private async processResponseError<T>(
        response: HttpServiceResponseResult,
        path: string
    ): Promise<T | never> {
        const responseData: any = isEmpty(response.data) ? response.message : response.data;
        const statusCode: HttpStatusCode = response.statusCode || response.code;

        console.error(`${this.logPrefix} error`, { path, statusCode, responseData });

        switch (statusCode) {
            case HttpStatusCode.BAD_REQUEST: {
                throw new ServiceUnavailableError(`${this.logPrefix} Bad request`);
            }
            case HttpStatusCode.UNAUTHORIZED: {
                throw new ServiceUnavailableError(`${this.logPrefix} Unauthorized request to the service`);
            }
            case HttpStatusCode.FORBIDDEN: {
                throw new ServiceUnavailableError(`${this.logPrefix} service is forbidden`);
            }
            case HttpStatusCode.REQUEST_TIMEOUT: {
                throw new ServiceUnavailableError(`${this.logPrefix} ${responseData}`);
            }
            case HttpStatusCode.INTERNAL_SERVER_ERROR: {
                throw new ServiceUnavailableError(`${this.logPrefix} service internal error`);
            }
            default: {
                throw new ServiceUnavailableError(`${this.logPrefix} service unknown error`);
            }
        }
    }

    private async makeApiCall(path: string, ops: MakeApiCallOps = {}): Promise<HttpServiceResponse> {
        const { data, method = HttpMethod.GET } = ops;

        console.info(`${this.logPrefix} Start calling provider`, { path, data, method });

        return this.httpService[method.toLowerCase()](
            {
                host: this.transcriptionApiHost,
                port: this.transcriptionApiPort,
                path,
                headers: {
                    'Content-Type': 'application/json'
                },
                rejectUnauthorized: false,
                timeout: this.requestTimeout
            },
            undefined,
            JSON.stringify(data)
        );
    }
}

export default new TranscriptionProvider();
