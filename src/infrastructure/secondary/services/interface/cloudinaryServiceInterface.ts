import { CloudinaryUploadResponseType } from '../types/cloudinaryServiceTypes';

export const CLOUDINARY_SERVICE_TOKEN = Symbol('CloudinaryServiceInterface');

export interface CloudinaryServiceInterface {
  uploadImage(
    file: string,
    publicId: string
  ): Promise<CloudinaryUploadResponseType>;
}
