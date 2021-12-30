import { Request, Response } from 'express';

import fileService from '../services/file';

import { UploadAudioBodyRequest } from '../interfaces/controllers/file';

class FileController {
    async uploadAudio(req: Request, res: Response): Promise<void> {
        try {
            const { botType, appUserId, link, lang } = <UploadAudioBodyRequest>req.body;

            const success: boolean = await fileService.uploadAudio(botType, appUserId, link, lang);

            res.send({ success });
        } catch (err) {
            console.error('Got error', err);

            res.status(err.code || 400).send({ message: err?.message || 'Unknown error' });
        }
    }
}

export default new FileController();
