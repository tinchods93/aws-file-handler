export const CLOUDINARY_SERVICE_TOKEN = Symbol('CloudinaryServiceInterface');

export interface CloudinaryServiceInterface {
  upload(uploadDTO: { file: string; id: string }): Promise<string>;
  delete(id: string): Promise<boolean>;
  getUri(id: string): string;
}
