import { S3ServiceInterface } from '../../services/interface/s3ServiceInterface';

export const S3_REPOSITORY_TOKEN = Symbol('S3RepositoryInterface');

export interface S3RepositoryInterface {
  getInstance(bucketName: string): S3ServiceInterface;
}
