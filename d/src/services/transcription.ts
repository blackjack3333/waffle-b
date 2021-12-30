import { ObjectId } from 'bson';

import spaceService from './space';
import fileService from './file';

import { SpaceModel } from '../interfaces/models/space';
import { FileTranscription } from '../interfaces/services/file';

class TranscriptionService {
    async getUserTranscriptionsBySpaceHashId(userId: ObjectId, spaceHashId: string): Promise<FileTranscription[]> {
        const space: SpaceModel = await spaceService.getByHashIdAndUserId(spaceHashId, userId);

        return fileService.getAllFileTranscriptionsBySpaceIdAndUserId(space._id, userId);
    }

    async getUserTranscriptionDetails(userId: ObjectId, spaceHashId: string, transcriptionHashId: string): Promise<FileTranscription> {
        const space: SpaceModel = await spaceService.getByHashIdAndUserId(spaceHashId, userId);

        return fileService.getFileTranscriptionByHashIdSpaceIdAndUserId(transcriptionHashId, space._id, userId);
    }
}

export default new TranscriptionService();
