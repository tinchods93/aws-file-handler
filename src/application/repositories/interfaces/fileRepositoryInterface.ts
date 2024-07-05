import { ImageEntityTableItemType } from '../../../domain/entities/imageEntity/types/imageEntityTypes';

export const FILE_REPOSITORY_TOKEN = Symbol('FileRepositoryInterface');

export interface FileRepositoryInterface {
  uploadImage(payload: {
    file: string;
    uploaderId: string;
    tags?: string;
  }): Promise<ImageEntityTableItemType>;
  deleteImage(payload: { publicId: string }): Promise<any>;
  uploadFile(payload: {
    file: string;
    uploaderId: string;
    tags?: string;
  }): Promise<any>;
  getFile(payload: { fileName: string }): Promise<any>;
  deleteFile(payload: { fileName: string }): Promise<any>;
  updateFile(payload: { file: string; fileName: string }): Promise<any>;
}
