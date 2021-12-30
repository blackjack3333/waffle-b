import { randomBytes } from 'crypto';

import configService from '../services/config';

export default class Utils {
    static createRandomBytes(): string {
        const buffer: Buffer = randomBytes(configService.get('hashBytes'));

        return buffer.toString('hex');
    }
}