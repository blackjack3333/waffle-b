import { Request, Response } from 'express';

import userService from '../services/user';
import spaceService from '../services/space';

import { UserModel } from '../interfaces/models/user';
import { UserSpaces } from '../interfaces/dataMappers/space';

class SpaceController {
    async getList(req: Request, res: Response): Promise<void> {
        try {
            const user: UserModel = await userService.addOrUpdateUserByAccessToken(req.auth.token);

            const spaces: UserSpaces = await spaceService.getUserSpaces(user._id);

            res.json({ spaces });
        } catch (err) {
            console.error('Got error', err);

            res.status(err.code || 400).send({ message: err?.message || 'Unknown error' });
        }
    }
}

export default new SpaceController();
