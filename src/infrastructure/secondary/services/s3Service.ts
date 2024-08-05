import s3 from 'rebased/service/storage/s3';
import { S3ServiceInterface } from './interface/s3ServiceInterface';

export default class S3Service implements S3ServiceInterface {
  bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async uploadFile(file: string, fileName: string, mediaType: string) {
    // Convertir los datos del archivo a un Buffer
    const fileBuffer = Buffer.from(file, 'base64');

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mediaType,
    };
    const response = await s3.uploadFile(params);

    return response;
  }

  async getFile(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };
    const response = await s3.getFile(params);

    return response;
  }

  async getSignedurl(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      expiresIn: 3600,
    };
    const response = await s3.getSignedUrl(params);

    return response;
  }

  async deleteFile(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };
    const response = await s3.deleteFile(params);

    return response;
  }
}
