import { S3ServiceInterface } from '../services/interface/s3ServiceInterface';
import S3Service from '../services/s3Service';
import { S3RepositoryInterface } from './interfaces/s3RepositoryInterface';

export default class S3Repository implements S3RepositoryInterface {
  getInstance(bucketName: string): S3ServiceInterface {
    return new S3Service(bucketName);
  }
}
