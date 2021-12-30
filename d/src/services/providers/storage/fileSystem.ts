// For the test purposes only

import { promises as fs } from 'fs';
import { dirname } from 'path';

import { StorageProvider } from '../../../interfaces/services/providers/storage';
import { Acl } from '../../../interfaces/services/file';

class FileSystemService implements StorageProvider {
    private readonly storageFolder: string = 'storage';

    async init(): Promise<void> {
        console.info('FileSystem initalization is empty');
    }

    async uploadFile(filePath: string, file: Buffer, acl: Acl): Promise<string> {
        const folderPath: string = this.getFullPath(dirname(filePath));

        console.info('Start creating folders if they are not exist', { folderPath });
        await fs.mkdir(folderPath, { recursive: true });
        console.debug('Created folders', { folderPath });
        console.info('Start write file on disk', { filePath });
        await fs.writeFile(this.getFullPath(filePath), file);

        return filePath;
    }

    async downloadFile(filePath: string, acl: Acl): Promise<Buffer> {
        return fs.readFile(this.getFullPath(filePath));
    }

    getFileUrl(filePath: string): string {
        return 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png';
    }

    async deleteFile(filePath: string): Promise<void> {
        return fs.unlink(filePath);
    }

    private getFullPath(filePath: string): string {
        return `${this.storageFolder}/${filePath}`;
    }
}

export default new FileSystemService();
