export enum StorageType {
    FileSystem = 'fileSystem',
    Zenko = 'zenko'
}

export enum Acl {
    Private = 'private',
    Public = 'public'
}

export enum FileTypeDirectory {
    Audios = 'audios'
}

export interface FileTranscription {
    id: string;
    link: string;
    text: string;
}
