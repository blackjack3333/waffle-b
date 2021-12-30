import { Request, Response } from 'express';

import userService from '../services/user';
import transcriptionService from '../services/transcription';

import { UserModel } from '../interfaces/models/user';
import { FileTranscription } from '../interfaces/services/file';

class TranscriptionController {
    async getListBySpaceHashId(req: Request, res: Response): Promise<void> {
        try {
            const spaceHashId: string = req.params.spaceHashId;
            const { _id: userId }: UserModel = await userService.addOrUpdateUserByAccessToken(req.auth.token);

            const transcriptions: FileTranscription[] = await transcriptionService.getUserTranscriptionsBySpaceHashId(userId, spaceHashId);

            res.json({ transcriptions });
        } catch (err) {
            console.error('Got error', err);

            res.status(err.code || 400).send({ message: err?.message || 'Unknown error' });
        }
    }

    async getTranscriptionDetails(req: Request, res: Response): Promise<void> {
        try {
            const { spaceHashId, transcriptionHashId } = req.params;
            const { _id: userId }: UserModel = await userService.addOrUpdateUserByAccessToken(req.auth.token);

            const transcriptionDetails: FileTranscription = await transcriptionService.getUserTranscriptionDetails(
                userId,
                spaceHashId,
                transcriptionHashId
            );

            res.json({ transcription: transcriptionDetails });
        } catch (err) {
            console.error('Got error', err);

            res.status(err.code || 400).send({ message: err?.message || 'Unknown error' });
        }
    }
}

export default new TranscriptionController();
