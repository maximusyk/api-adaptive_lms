import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import internal from 'stream';

@Injectable()
export class AwsService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async uploadFile(fileName: string, file: Buffer | Blob | ArrayBuffer | ArrayBufferView): Promise<string> {
        try {
            const s3 = new S3();
            const uploadedFile = await s3.upload({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName,
                Body: file
            }).promise();

            return uploadedFile.Key;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async updateFile(fileName: string, file: Buffer | Blob | ArrayBuffer | ArrayBufferView): Promise<string> {
        try {
            const s3 = new S3();
            const uploadedFile = await s3.upload({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName,
                Body: file
            }).promise();

            return uploadedFile.Key;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async deleteFile(fileName: string) {
        try {
            const s3 = new S3();
            await this.getFile(fileName);
            await s3.deleteObject({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName
            });

            return true;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async getFile(fileName: string) {
        try {
            const s3 = new S3();
            const uploadedFile = await s3.getObject({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName
            }).promise();

            return uploadedFile.Body;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async getFileStream(fileName: string): Promise<internal.Readable> {
        try {
            const s3 = new S3();
            const uploadedFile = await s3.getObject({
                Bucket: this.configService.get('AWS_BUCKET'),
                Key: fileName
            });

            return uploadedFile.createReadStream();
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async getFileUrl(fileName: string) {
        try {
            // TODO - implement getting file url
            // const s3 = new S3();
            // const uploadedFile = await s3.getObject({
            //     Bucket: this.configService.get('AWS_BUCKET'),
            //     Key: fileName
            // }).promise();
            //
            // return uploadedFile.;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}