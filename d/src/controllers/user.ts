import { Request, Response } from 'express';

import userService from '../services/user';
import authUrlService from '../services/authUrl';

import { AuthUrlSource } from '../interfaces/services/authUrl';
import { UserModel } from '../interfaces/models/user';

class UserController {
    async addOrUpdateProfile(req: Request, res: Response): Promise<void> {
        try {
            const user: UserModel = await userService.addOrUpdateUserByAccessToken(req.auth.token);
            if (Object.values(req.query)) {
                const { source, uid } = req.query;

                await authUrlService.connectBotWithUserAndNotifyBot(<AuthUrlSource>source, <string>uid, user._id);
            }

            res.send();
        } catch (err) {
            console.error('Got error', err);

            res.status(err.code || 400).send({ message: err?.message || 'Unknown error' });
        }
    }
}

export default new UserController();
