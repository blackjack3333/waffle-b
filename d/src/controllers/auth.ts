import { Request, Response } from 'express';

import authUrlService from '../services/authUrl';

import { GetAuthUrlRequest } from '../interfaces/controllers/auth';

class AuthController {
    async getAuthUrlByTarget(req: Request, res: Response): Promise<void> {
        try {
            const { params: { target }, query }: GetAuthUrlRequest = <GetAuthUrlRequest><unknown>req;

            const authUrlByTarget: string = await authUrlService.generateAuthUrlByTarget(target, query);

            res.json({ authUrl: authUrlByTarget });
        } catch (err) {
            console.error('Got error', err);

            res.status(err.code || 400).send({ message: err?.message || 'Unknown error' });
        }
    }
}

export default new AuthController();