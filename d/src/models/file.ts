import { model, Schema } from 'mongoose';
import { ObjectId } from 'bson';

import { FileModel, FileLang } from '../interfaces/models/file';

const fileSchema: Schema = new Schema(
    {
        hashId: { type: String, unique: true, required: true },
        spaceId: { type: ObjectId, index: true, required: true },
        userId: { type: ObjectId, index: true, required: true },
        path: { type: String, required: true },
        lang: { type: String, enum: Object.values(FileLang), required: true },
        sourceFileLink: { type: String, required: true },
        transcription: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export default model<FileModel>('File', fileSchema);
