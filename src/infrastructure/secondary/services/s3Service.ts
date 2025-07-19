import s3 from 'rebased/service/storage/s3';
import { S3ServiceInterface } from './interface/s3ServiceInterface';

export default class S3Service implements S3ServiceInterface {
  bucketName: string;

  constructor() {
    this.bucketName = process.env.FILE_BUCKET_NAME as string;
  }

  /**
   * Sube un archivo al bucket S3 especificado.
   * @param file Archivo en base64.
   * @param fileName Nombre del archivo en S3.
   * @param mediaType Tipo MIME del archivo.
   * @returns Respuesta del servicio S3.
   */
  async upload(uploadDTO: { file: string; id: string }) {
    const [mediaType, base64Data] = uploadDTO.file.split(',');
    // Convertir los datos del archivo a un Buffer
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const params = {
      Bucket: this.bucketName,
      Key: uploadDTO.id,
      Body: fileBuffer,
      ContentType: mediaType,
    };

    const response = await s3.uploadFile(params);

    return response;
  }

  /**
   * Obtiene un archivo del bucket S3 por su clave.
   * @param key Clave (Key) del archivo en S3.
   * @returns Respuesta del servicio S3 con el archivo.
   */
  async get(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };
    const response = await s3.getFile(params);

    return response;
  }

  /**
   * Obtiene una URL firmada para acceder a un archivo en S3.
   * @param key Clave (Key) del archivo en S3.
   * @returns URL firmada válida por 1 hora.
   */
  async getSignedUrl(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      expiresIn: 3600,
    };
    const response = await s3.getSignedUrl(params);

    return response;
  }

  /**
   * Elimina un archivo del bucket S3 por su clave.
   * @param id Clave (Key) del archivo en S3.
   * @returns Respuesta del servicio S3 tras eliminar el archivo.
   */
  async delete(id: string) {
    const params = {
      Bucket: this.bucketName,
      Key: id,
    };
    const response = await s3.deleteFile(params);

    return response;
  }
}
