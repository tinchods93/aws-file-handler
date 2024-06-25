import { inject, injectable } from 'tsyringe';

import FileServiceException from './errors/fileServiceException';
import { ErrorCodesEnum } from '../../commons/errors/enums/errorCodesEnum';
import {
  FILE_SERVICE_TOKEN,
  FileServiceInterface,
} from '../../domain/services/interfaces/fileServiceInterface';
import { FileRepositoryInterface } from './interfaces/fileRepositoryInterface';

@injectable()
export default class FileRepository implements FileRepositoryInterface {
  constructor(
    @inject(FILE_SERVICE_TOKEN) private fileService: FileServiceInterface
  ) {}

  async uploadImage(payload: {
    file: string;
    uploaderId: string;
    tags?: string;
  }) {
    try {
      const response = await this.fileService.uploadImage(
        payload.file,
        payload.uploaderId,
        payload.tags
      );
      return response;
    } catch (error) {
      console.log('MARTIN_LOG=> FileRepository -> uploadImage -> error', error);
      throw FileServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.UPLOAD_IMAGE_FAILED,
        status: error.status,
        payload,
        error,
      });
    }
  }

  async uploadFile(payload: {
    file: string;
    uploaderId: string;
    tags?: string;
  }): Promise<any> {
    try {
      const response = await this.fileService.uploadFileToS3(
        payload.file,
        payload.uploaderId,
        payload.tags
      );
      return response;
    } catch (error) {
      console.log('MARTIN_LOG=> FileRepository -> uploadFile -> error', error);
      throw FileServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.UPLOAD_FILE_FAILED,
        status: error.status,
        payload,
        error,
      });
    }
  }

  async getFile(payload: { fileName: string }) {
    try {
      const response = await this.fileService.getFileFromS3(payload.fileName);
      return response;
    } catch (error) {
      console.log('MARTIN_LOG=> FileRepository -> uploadImage -> error', error);
      throw FileServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.GET_FILE_FAILED,
        status: error.status,
        payload,
        error,
      });
    }
  }

  async deleteFile(payload: { fileName: string }) {
    try {
      const response = await this.fileService.deleteFileFromS3(
        payload.fileName
      );
      return response;
    } catch (error) {
      console.log('MARTIN_LOG=> FileRepository -> uploadImage -> error', error);
      throw FileServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.DELETE_FILE_FAILED,
        status: error.status,
        payload,
        error,
      });
    }
  }

  async updateFile(payload: { file: string; fileName: string }) {
    try {
      const response = await this.fileService.updateFileFromS3(
        payload.file,
        payload.fileName
      );
      return response;
    } catch (error) {
      console.log('MARTIN_LOG=> FileRepository -> updateFile -> error', error);
      throw FileServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.UPDATE_FILE_FAILED,
        status: error.status,
        payload,
        error,
      });
    }
  }
}
