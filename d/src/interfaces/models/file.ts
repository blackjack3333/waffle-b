import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export enum FileLang {
    RU = 'ru',
    EN = 'en'
}

export interface File {
    hashId: string;
    spaceId: ObjectId;
    userId: ObjectId;
    path: string;
    lang: FileLang;
    sourceFileLink: string;
    transcription: string;
}

export interface FileModel extends File, Document {}
