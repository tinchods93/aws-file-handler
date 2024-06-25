import { ImageEntityTableItemType } from '../../entities/imageEntity/types/imageEntityTypes';

export const FILE_SERVICE_TOKEN = Symbol('FileServiceInterface');

export interface FileServiceInterface {
  uploadImage(
    imageFile: string,
    uploaderId: string,
    tags?: string
  ): Promise<ImageEntityTableItemType>;
  uploadFileToS3(file: string, uploaderId: string, tags?: string): Promise<any>;
  getFileFromS3(key: string): Promise<any>;
  deleteFileFromS3(key: string): Promise<any>;
  updateFileFromS3(file: string, key: string): Promise<any>;
  // deleteImage(payload: any): Promise<any>;
}
