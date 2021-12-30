import { AppDbConfig } from '../interfaces/services/config';
import { StorageType } from '../interfaces/services/file';
import { RedisClientConfig, RedisConfig } from '../interfaces/libs/redis';

export default {
    app: {
        port: process.env.APP_PORT
            ? parseInt(process.env.APP_PORT, 10)
            : 3000,
        baseUrl: process.env.APP_BASE_URL,
        integrationPointsTimeout: process.env.APP_INTEGRATION_TIMEOUT_IN_MSEC
            ? parseInt(process.env.APP_INTEGRATION_TIMEOUT_IN_MSEC, 10)
            : 10 * 1000
    },

    db: <AppDbConfig>{
        host: process.env.MONGO_HOST,
        port: parseInt(process.env.MONGO_PORT, 10),
        database: process.env.MONGO_DATABASE,
        replicaSet: process.env.MONGO_REPLICA_SET,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        authSource: process.env.MONGO_AUTH_SOURCE
    },

    auth0: {
        sessionSecret: process.env.AUTH0_SESSION_SECRET,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        clientId: process.env.AUTH0_CLIENT_ID,
        issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
        audience: process.env.AUTH0_AUDIENCE,
        authCallbackPath: process.env.AUTH0_AUTH_CALLBACK_PATH,
        authorizationParamsResponseType: process.env.AUTH0_AUTHORIZATION_PARAMS_RESPONSE_TYPE
    },

    ui: {
        baseUrl: process.env.UI_BASE_URL,
        loginPath: process.env.UI_LOGIN_PATH
    },

    storages: {
        type: process.env.STORAGE_TYPE || StorageType.FileSystem,
        [StorageType.Zenko]: {
            host: process.env.ZENKO_HOST,
            accessKey: process.env.ZENKO_ACCESS_KEY,
            secretKey: process.env.ZENKO_SECRET_KEY,
            bucket: process.env.ZENKO_BUCKET
        }
    },

    transcription: {
        host: process.env.TRANSCRIPTION_API_HOST,
        port: process.env.TRANSCRIPTION_API_PORT
            ? parseInt(process.env.TRANSCRIPTION_API_PORT, 10)
            : 443,
        httpProtocol: process.env.TRANSCRIPTION_API_HTTP_PROTOCOL,
        getTranscriptionPath: process.env.TRANSCRIPTION_API_GET_TRANSCRIPTION_PATH
    },

    redis: <RedisConfig> {
        readWrite: <RedisClientConfig> {
            host: process.env.REDIS_READ_WRITE_HOST,
            port: process.env.REDIS_READ_WRITE_PORT
                ? parseInt(process.env.REDIS_READ_WRITE_PORT, 10)
                : 6379,
            db: process.env.REDIS_READ_WRITE_DB
                ? parseInt(process.env.REDIS_READ_WRITE_DB, 10)
                : 0,
            password: process.env.REDIS_READ_WRITE_PASSWORD
        },
        readOnly: <RedisClientConfig> {
            host: process.env.REDIS_READ_ONLY_HOST,
            port: process.env.REDIS_READ_ONLY_PORT
                ? parseInt(process.env.REDIS_READ_ONLY_PORT, 10)
                : 6379,
            db: process.env.REDIS_READ_ONLY_DB
                ? parseInt(process.env.REDIS_READ_ONLY_DB, 10)
                : 0,
            password: process.env.REDIS_READ_ONLY_PASSWORD
        }
    },

    swagger: {
        isEnabled: process.env.SWAGGER_IS_ENABLED === 'true',
        path: process.env.SWAGGER_PATH
    },

    hashBytes: process.env.HASH_BYTES
        ? parseInt(process.env.HASH_BYTES, 10)
        : 10
};
