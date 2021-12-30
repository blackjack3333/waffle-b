import { cloneDeep } from 'lodash';
import { RequestOptions, request as httpsRequest, Agent } from 'https';
import * as tsl from 'tls';
import { IncomingMessage, ClientRequest, request as httpRequest, IncomingHttpHeaders } from 'http';
import { stringify } from 'querystring';
import to from 'await-to-js';

import { HttpServiceResponse, HttpMethod, PeerCertificateWithSHA256, HttpProtocol } from '../interfaces/libs/http';
import { RequestTimeoutError, ServiceUnavailableError } from '../errors/Errors';

export class HttpService {
    private requestFn: Function;

    constructor(private logger: Console, protocol: HttpProtocol) {
        this.requestFn = protocol === HttpProtocol.Http ? httpRequest : httpsRequest;
    }

    async get(options: RequestOptions, hostFingerprint?: string): Promise<HttpServiceResponse> {
        this.setMethod(options, HttpMethod.GET);
        this.setCheckServerIdentity(options, hostFingerprint);

        return to(this.makeRequest(options));
    }

    async post(options: RequestOptions, hostFingerprint?: string, body?: any): Promise<HttpServiceResponse> {
        this.setMethod(options, HttpMethod.POST);
        this.setCheckServerIdentity(options, hostFingerprint);

        return to(this.makeRequest(options, body));
    }

    async delete(options: RequestOptions, hostFingerprint?: string, body?: any): Promise<HttpServiceResponse> {
        this.setMethod(options, HttpMethod.DELETE);
        this.setCheckServerIdentity(options, hostFingerprint);

        return to(this.makeRequest(options, body));
    }

    async put(options: RequestOptions, hostFingerprint?: string, body?: any): Promise<HttpServiceResponse> {
        this.setMethod(options, HttpMethod.PUT);
        this.setCheckServerIdentity(options, hostFingerprint);

        return to(this.makeRequest(options, body));
    }

    private setMethod(options: RequestOptions, method: HttpMethod): void {
        options.method = method;
    }

    private setCheckServerIdentity(options: RequestOptions, hostFingerprint?: string): void {
        if (!hostFingerprint) {
            return;
        }

        const checkServerIdentity: typeof tsl.checkServerIdentity = (host: string, cert: PeerCertificateWithSHA256): Error | undefined => {
            const certFingerprint: string = cert.fingerprint256 || cert.fingerprint;

            this.logger.info(`Checking fingerprint for host: ${host}, fingerprint is ${certFingerprint}`);
            if (!hostFingerprint || hostFingerprint === certFingerprint) {
                this.logger.info('Fingerprint validated successfully');

                return;
            }

            this.logger.info('Failed to validate fingerprint');

            return new Error(`Fingerprint for host ${host} does not match`);
        };

        if (options.agent instanceof Agent) {
            (<Agent>options.agent).options.checkServerIdentity = checkServerIdentity;
        } else {
            options.agent = new Agent({ checkServerIdentity });
        }
    }

    private makeRequest(options: RequestOptions, body?: any): Promise<any> {
        return new Promise((resolve: Function, reject: Function): void => {
            try {
                let data: string = '';

                const request: ClientRequest = this.requestFn(options, (response: IncomingMessage) => {
                    response.setEncoding('utf8');
                    response.on('data', (chunk: string): void => {
                        data += chunk;
                    });

                    response.on('end', (): void => {
                        let parsedData: object;
                        const res: IncomingMessage & { data?: any } = cloneDeep(response);
                        const { statusCode } = res;
                        const isSuccessStatusCode: boolean = /2\d{2}/.test(statusCode.toString());

                        res.data = res.data || undefined;

                        if (!data) {
                            this.logger.info('No data in response', { statusCode });

                            return isSuccessStatusCode ? resolve(res) : reject(res);
                        }

                        try {
                            if (this.isJsonContentType(response.headers)) {
                                parsedData = JSON.parse(data);
                                res.data = parsedData;
                            } else {
                                res.data = data;
                            }
                        } catch (err) {
                            this.logger.error(`Failed to parse data: ${data}`);

                            return reject(err);
                        }

                        if (!isSuccessStatusCode) {
                            return reject(res);
                        }

                        return resolve(res);
                    });
                });

                request.on('error', (err: Error): Promise<Error> => reject(err));

                request.on('timeout', (): Promise<Error> => {
                    const message: string = 'Failed due timeout reason';

                    this.logger.error(message);

                    return reject(new RequestTimeoutError(message));
                });

                request.on('abort', (): Promise<Error> => {
                    const message: string = 'Failed due abort reason';

                    this.logger.error(message);

                    return reject(new ServiceUnavailableError(message));
                });

                if (body) {
                    const preparedBody: string = typeof body === 'string' ? body : stringify(body);

                    request.write(preparedBody);
                }

                request.end();
            } catch (err) {
                return reject(err);
            }
        });
    }

    private isJsonContentType(headers: IncomingHttpHeaders): boolean {
        return /^application\/json/.test(headers['content-type']);
    }
}
