import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryServiceInterface } from './interface/cloudinaryServiceInterface';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default class CloudinaryService implements CloudinaryServiceInterface {
  /**
   * Sube una imagen a Cloudinary y retorna las URLs optimizada y original.
   * @param file Imagen en base64 o URL.
   * @param id Identificador público para la imagen en Cloudinary.
   * @returns Objeto con la URL optimizada y la URL original de la imagen subida.
   */
  async upload(uploadDTO: { file: string; id: string }) {
    const response = await cloudinary.uploader.upload(uploadDTO.file, {
      public_id: uploadDTO.id,
      transformation: [
        { width: 2000, height: 4000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    if (!response || !response.secure_url) {
      throw new Error('Error uploading image to Cloudinary');
    }

    return this.getUri(uploadDTO.id);
  }

  /**
   * Elimina una imagen de Cloudinary por su publicId.
   * @param id Identificador público de la imagen a eliminar.
   * @returns Respuesta de Cloudinary tras la eliminación.
   */
  async delete(id: string) {
    const response = await cloudinary.uploader.destroy(id);
    console.log(
      'MARTIN_LOG=> Cloudinary delete response:',
      JSON.stringify(response)
    );
    if (response.result !== 'ok') {
      throw new Error(
        `Error deleting image from Cloudinary: ${response.result}`
      );
    }

    return true;
  }

  getUri(publicId: string): string {
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
  }
}
