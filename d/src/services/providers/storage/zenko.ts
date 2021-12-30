import * as https from 'https';
import { promisify } from 'util';

import * as AWS from 'aws-sdk';
import {
    Bucket,
    CreateBucketRequest,
    CreateBucketOutput,
    ObjectCannedACL,
    ListBucketsOutput,
    PutObjectRequest,
    PutObjectOutput,
    GetObjectRequest,
    GetObjectOutput,
    DeleteObjectRequest,
    DeleteObjectOutput
} from 'aws-sdk/clients/s3';

import configService from '../../config';

import { StorageProvider } from '../../../interfaces/services/providers/storage';
import { Acl } from '../../../interfaces/services/file';
import { AclFolder } from '../../../interfaces/services/providers/storage/zenko';

class ZenkoService implements StorageProvider {
    private client: AWS.S3;

    private bucket: string;

    private readonly aclToFolder: Record<Acl, AclFolder> = {
        [Acl.Private]: AclFolder.Private,
        [Acl.Public]: AclFolder.Public
    };

    private readonly objectAcl: Record<Acl, ObjectCannedACL> = {
        [Acl.Private]: 'authenticated-read',
        [Acl.Public]: 'public-read'
    };

    private createBucket: (params: CreateBucketRequest) => Promise<CreateBucketOutput>;

    private listBuckets: () => Promise<ListBucketsOutput>;

    private putObject: (req: PutObjectRequest) => Promise<PutObjectOutput>;

    private getObject: (req: GetObjectRequest) => Promise<GetObjectOutput>;

    private deleteObject: (req: DeleteObjectRequest) => Promise<DeleteObjectOutput>;

    async init(): Promise<void> {
        this.client = new AWS.S3({
            endpoint: configService.get('storages.zenko.host'),
            accessKeyId: configService.get('storages.zenko.accessKey'),
            secretAccessKey: configService.get('storages.zenko.secretKey'),
            s3ForcePathStyle: true,
            httpOptions: {
                agent: new https.Agent({ rejectUnauthorized: false })
            },
            signatureVersion: 'v2'
        });

        this.createBucket = promisify(this.client.createBucket.bind(this.client));

        this.listBuckets = promisify(this.client.listBuckets.bind(this.client));

        this.putObject = promisify(this.client.putObject.bind(this.client));

        this.getObject = promisify(this.client.getObject.bind(this.client));

        this.deleteObject = promisify(this.client.deleteObject.bind(this.client));

        this.bucket = configService.get('storages.zenko.bucket');

        const { Buckets } = await this.listBuckets();
        const matchedBucket: Bucket = Buckets.find((bucket: Bucket) => bucket.Name === this.bucket);
        if (!matchedBucket) {
            console.info(`Bucket not found: ${this.bucket}. Start create it.`);

            const { Location } = await this.createBucket({ Bucket: this.bucket });

            console.info(`New locations successfully created: ${Location}`);
        }

        console.info(`Found bucket: ${this.bucket}`);
    }

    async uploadFile(filePath: string, file: Buffer, acl: Acl): Promise<string> {
        const folder: AclFolder = this.aclToFolder[acl];
        const objectAcl: ObjectCannedACL = this.objectAcl[acl];
        const Key: string = this.buildKey(folder, filePath);
        const { ETag } = await this.putObject({ Bucket: this.bucket, Key, Body: file, ACL: objectAcl });

        console.info(`File [${Key}] uploaded successfully to Zenko storage`, { ETag });

        return Key;
    }

    async downloadFile(filePath: string): Promise<Buffer> {
        const { Body } = await this.getObject({ Bucket: this.bucket, Key: filePath });

        return <Buffer>Body;
    }

    async deleteFile(filePath: string): Promise<void> {
        const Key: string = this.buildKey(AclFolder.Public, filePath);

        await this.deleteObject({ Bucket: this.bucket, Key });
    }

    getFileUrl(filePath: string): string {
        return `https://${configService.get('storages.zenko.host')}/${this.bucket}/${filePath}`;
    }

    private buildKey(folder: AclFolder, filePath: string): string {
        return `${folder}${filePath}`;
    }
}

export default new ZenkoService();
