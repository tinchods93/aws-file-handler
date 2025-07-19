export const S3_SERVICE_TOKEN = Symbol('S3ServiceInterface');

export interface S3ServiceInterface {
  upload(uploadDTO: { file: string; id: string }): Promise<any>;
  get(id: string): Promise<any>;
  delete(id: string): Promise<any>;
  getSignedUrl(id: string): Promise<any>;
}
