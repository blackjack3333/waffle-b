import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { get } from 'lodash';

dotenv.config();

import { Config, Env } from '../interfaces/services/config';

class ConfigService {
    private defaultPathConfig: string = resolve('dist/env/index.js');

    private config: Config;

    constructor() {
        if (!existsSync(this.defaultPathConfig)) {
            throw new Error(`Could not find config file for '${process.env.NODE_ENV}' environment at ${this.defaultPathConfig}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.config = require(this.defaultPathConfig).default;
    }

    get(param: string): any {
        return get(this.config, param);
    }

    isLocal(): boolean {
        return this.getEnv() === Env.Local;
    }

    isTest(): boolean {
        return this.getEnv() === Env.Test;
    }

    isStage(): boolean {
        return this.getEnv() === Env.Stage;
    }

    isDev(): boolean {
        return this.getEnv() === Env.Dev;
    }

    isProd(): boolean {
        return this.getEnv() === Env.Prod;
    }

    private getEnv(): Env {
        return <Env>process.env.NODE_ENV;
    }
}

export default new ConfigService();
