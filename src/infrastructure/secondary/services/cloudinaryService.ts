import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResponseType } from './types/cloudinaryServiceTypes';
import { CloudinaryServiceInterface } from './interface/cloudinaryServiceInterface';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default class CloudinaryService implements CloudinaryServiceInterface {
  async uploadImage(
    file: string,
    publicId: string
  ): Promise<CloudinaryUploadResponseType> {
    const response = await cloudinary.uploader.upload(file, {
      public_id: publicId,
      transformation: [
        { width: 2000, height: 4000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      optimizedUrl: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`,
      originalUrl: response.secure_url,
    };
  }

  async deleteImage(publicId: string): Promise<any> {
    const response = await cloudinary.uploader.destroy(publicId);

    return response;
  }
}
