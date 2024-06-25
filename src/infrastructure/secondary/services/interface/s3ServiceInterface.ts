export const S3_SERVICE_TOKEN = Symbol('S3ServiceInterface');

export interface S3ServiceInterface {
  uploadFile(file: string, fileName: string, mediaType: string): Promise<any>;
  getFile(key: string): Promise<any>;
  deleteFile(key: string): Promise<any>;
  getSignedurl(key: string): Promise<any>;
}
