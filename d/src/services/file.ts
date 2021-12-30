import { ObjectId } from 'bson';
import { basename } from 'path';
import https from 'https';
import { IncomingMessage } from 'http';
import { escape } from 'querystring';

import configService from './config';
import userBotService from './userBot';
import spaceService from './space';

import fileSystemServiceProvider from './providers/storage/fileSystem';
import zenkoServiceProvider from './providers/storage/zenko';
import transcriptionProvider from './providers/transcription';

import fileModel from '../models/file';

import Utils from '../utils';

import { UserBotModel, UserBotType } from '../interfaces/models/userBot';
import { StorageType, FileTypeDirectory, Acl, FileTranscription } from '../interfaces/services/file';
import { SpaceModel } from '../interfaces/models/space';
import { FileLang, FileModel } from '../interfaces/models/file';
import { StorageProvider } from '../interfaces/services/providers/storage';
import { ModelNotFoundError } from '../errors/ModelNotFoundError';

class FileService {
    private storage: StorageProvider;

    private storageType: StorageType;

    private readonly storageTypeToStorageServiceProvider: Record<StorageType, StorageProvider> = {
        [StorageType.FileSystem]: fileSystemServiceProvider,
        [StorageType.Zenko]: zenkoServiceProvider
    };

    async init(): Promise<void> {
        this.storageType = configService.get('storages.type');
        this.storage = this.storageTypeToStorageServiceProvider[this.storageType];
        if (!this.storage) {
            throw new Error(`There are no any storages by ${this.storageType} type`);
        }

        console.info(`Enabled ${this.storageType} storage`);

        console.info('Start storage initializing');
        await this.storage.init();
    }

    async uploadAudio(botType: UserBotType, appUserId: string, link: string, lang: FileLang): Promise<boolean> {
        const { _id: userBotId, userId }: UserBotModel = await userBotService.getUserBotByAppUserIdAndBotType(appUserId, botType);
        const space: SpaceModel = await spaceService.getSpaceByUserIdAndUserBotId(userId, userBotId);
        const hashId: string = Utils.createRandomBytes();

        const fileName: string = escape(basename(link));
        const filePath: string = this.generateFilePath(userId, botType, FileTypeDirectory.Audios, fileName);
        const fileContent: Buffer = await this.downloadFileByUrl(link);

        // TODO: Skip save same link for same user!!!
        const absolutePath: string = await this.storage.uploadFile(filePath, fileContent, Acl.Public);

        const storageFileUrl: string = await this.storage.getFileUrl(absolutePath);

        const transcription: string = await transcriptionProvider.getTranscriptionByUserIdAndLink(
            userId.toHexString(),
            storageFileUrl,
            lang
        );

        await fileModel.create({
            hashId,
            spaceId: space._id,
            userId,
            path: absolutePath,
            lang,
            sourceFileLink: link,
            transcription
        });

        console.log('Audio file successfully transcribed and stored in db', { userId, hashId });

        return true;
    }

    async getAllFileTranscriptionsBySpaceIdAndUserId(spaceId: ObjectId, userId: ObjectId): Promise<FileTranscription[]> {
        const files: FileModel[] = await fileModel.find({ spaceId, userId });

        return files.map(({ hashId, path, transcription }: FileModel): FileTranscription => ({
            id: hashId,
            link: this.storage.getFileUrl(path),
            text: transcription
        }));
    }

    async getFileTranscriptionByHashIdSpaceIdAndUserId(hashId: string, spaceId: ObjectId, userId: ObjectId): Promise<FileTranscription> {
        const file: FileModel = await fileModel.findOne({ hashId, spaceId, userId });
        if (!file) {
            throw new ModelNotFoundError(fileModel.modelName, hashId);
        }

        const { path, transcription } = file;

        return {
            id: hashId,
            link: this.storage.getFileUrl(path),
            text: transcription
        };
    }

    async getFileUrl(fileId: ObjectId): Promise<string> {
        const file: FileModel = await fileModel.findById(fileId);
        if (!file) {
            throw new ModelNotFoundError(fileModel.modelName, fileId.toHexString());
        }

        return this.storage.getFileUrl(file.path);
    }

    private generateFilePath(userId: ObjectId, botType: UserBotType, fileType: FileTypeDirectory, fileName: string): string {
        return `/${userId}/${botType}/${fileType}/${fileName}`;
    }

    private async downloadFileByUrl(url: string): Promise<Buffer | never> {
        return new Promise((resolve: Function, reject: Function) => {
            https.get(url, (res: IncomingMessage) => {
                const data: Uint8Array[] = [];

                res.on('data', (chunk: Uint8Array) => {
                    data.push(chunk);
                }).on('end', () => {
                    const buffer: Buffer = Buffer.concat(data);

                    resolve(buffer);
                });
            }).on('error', (err: Error) => {
                console.log('download error:', err);

                reject(err);
            });
        });
    }
}

export default new FileService();
