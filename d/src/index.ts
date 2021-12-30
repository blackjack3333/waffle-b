import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { FXValidationError } from 'express-fastest-validator';

import configService from './services/config';
import fileService from './services/file';

import { apiV1Router } from './routes';

import { AppDbConfig, ReplicaSetNodeConfig } from './interfaces/services/config';

const app: Express = express();
const appPort: number = configService.get('app.port');

async function initDbConnection(): Promise<void> {
    const {
        host,
        port,
        database,
        authSource,
        username,
        password,
        replicaSet,
        replicaSetNodes,
        readPreference
    }: AppDbConfig = configService.get('db');

    const dbConnectionOptions: mongoose.ConnectOptions = {};
    let hosts: string[] = [];
    if (host) {
        if (port) {
            hosts.push(`${host}:${port}`);
        } else {
            hosts.push(`${host}`);
        }
    }

    if (username && password) {
        dbConnectionOptions.auth = { username, password };
    }

    if (replicaSet) {
        dbConnectionOptions.replicaSet = replicaSet;
    }

    if (replicaSetNodes) {
        if (host) {
            const errMsg: string = 'Must be only `host` and `port` or `replicaSetNodes` config';

            console.error('Wrong database configuration:', errMsg);
            throw new Error(errMsg);
        }

        hosts = replicaSetNodes.map(({ replicaHost }: ReplicaSetNodeConfig) => `${replicaHost}:${port}`);
    }

    let dbConnectionString: string = `mongodb://${hosts.join(',')}/`;
    if (database) {
        dbConnectionString += database;
    }

    const query: string[] = [];
    if (authSource) {
        query.push(`authSource=${authSource}`);
    }

    if (readPreference) {
        query.push(`readPreference=${readPreference}`);
    }

    if (query.length) {
        dbConnectionString += `?${query.join('&')}`;
    }

    await mongoose.connect(dbConnectionString, dbConnectionOptions);
}

async function main(): Promise<void> {
    process
        .on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        })
        .on('uncaughtException', (err) => {
            console.error(err, 'Uncaught Exception thrown');
            // process.exit(1);
        });

    // Enable CORS
    app.use(cors());

    // Enable the use of request body parsing middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use('/api/v1', apiV1Router);

    // Error handler
    app.use((err: any, req: Request, res: Response, next: Function) => {
        if (err instanceof FXValidationError) {
            // Handle request invalidation error
            res.status(400).send(err.description);
        } else {
            // Handle all the others except request invalidation errors.
            res.status(err.code || 500).send(err.message || 'Something went wrong');
        }
    });

    await Promise.all([
        initDbConnection(),
        fileService.init()
    ]);

    app.listen(appPort, () => {
        console.log(`Server listening at ${configService.get('app.baseUrl')}`);
    });
}

main();
