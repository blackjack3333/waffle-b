import { Acl } from '../../file';

export interface StorageProvider {
    init(): Promise<void>;
    uploadFile(filePath: string, file: Buffer, acl: Acl): Promise<string>;
    downloadFile(filePath: string, acl: Acl): Promise<Buffer>;
    getFileUrl(filePath: string): string;
    deleteFile(filePath: string): Promise<void>;
}
