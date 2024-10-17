import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config();

class S3Service {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME as string;
        this.s3Client = new S3Client({
            region: process.env.AWS_BUCKET_REGION,
            credentials: {
                accessKeyId: process.env.AWS_USER_ACCESS_KEY as string,
                secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY as string,
            }
        });
    }

    async uploadFile(fileBuffer: Buffer, fileName: string, mimetype: string) {
        const uploadParams = {
            Bucket: this.bucketName,
            Body: fileBuffer,
            Key: fileName,
            ContentType: mimetype
        };

        return this.s3Client.send(new PutObjectCommand(uploadParams));
    }

    async deleteFile(fileName: string) {
        const deleteParams = {
            Bucket: this.bucketName,
            Key: fileName,
        };

        return this.s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    async getObjectSignedUrl(key: string) {
        const params = {
            Bucket: this.bucketName,
            Key: key
        };

        const command = new GetObjectCommand(params);

        return getSignedUrl(this.s3Client, command);
    }
}

export const s3Service = new S3Service();
