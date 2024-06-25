import { inject, injectable } from 'tsyringe';
import { FileServiceInterface } from './interfaces/fileServiceInterface';
import {
  CLOUDINARY_SERVICE_TOKEN,
  CloudinaryServiceInterface,
} from '../../infrastructure/secondary/services/interface/cloudinaryServiceInterface';
import {
  IMAGE_ENTITY_TOKEN,
  ImageEntityInterface,
} from '../entities/imageEntity/interfaces/imageEntityInterface';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from '../../infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import { TableServiceInterface } from '../../infrastructure/secondary/services/interface/tableServiceInterface';
import { ImageEntityTableItemType } from '../entities/imageEntity/types/imageEntityTypes';
import { S3ServiceInterface } from '../../infrastructure/secondary/services/interface/s3ServiceInterface';
import {
  S3RepositoryInterface,
  S3_REPOSITORY_TOKEN,
} from '../../infrastructure/secondary/repository/interfaces/s3RepositoryInterface';
import {
  FILE_ENTITY_TOKEN,
  FileEntityInterface,
} from '../entities/fileEntity/interfaces/fileEntityInterface';
import { EntitiesEnum } from '../../commons/entitiesEnum';
import { TableGsiEnum } from '../../commons/tableGsiEnum';
import { FileEntityTableItemType } from '../entities/fileEntity/types/fileEntityTypes';
import { ErrorMessagesEnum } from '../../commons/errors/enums/errorMessagesEnum';

const tableName = process.env.FILES_METADATA_TABLE_NAME as string;
const s3Name = process.env.FILE_BUCKET_NAME as string;

@injectable()
export default class FileService implements FileServiceInterface {
  private tableService: TableServiceInterface;

  private s3Service: S3ServiceInterface;

  constructor(
    @inject(CLOUDINARY_SERVICE_TOKEN)
    private cloudinaryService: CloudinaryServiceInterface,
    @inject(IMAGE_ENTITY_TOKEN)
    private imageEntity: ImageEntityInterface,
    @inject(FILE_ENTITY_TOKEN)
    private fileEntity: FileEntityInterface,
    @inject(TABLE_REPOSITORY_TOKEN)
    private tableRepository: TableRepositoryInterface,
    @inject(S3_REPOSITORY_TOKEN)
    private s3Repository: S3RepositoryInterface
  ) {
    // aca solo pasamos el schema desde ImageEntity pero porque son iguales
    this.tableService = tableRepository.getInstance(
      this.imageEntity.getTableSchema(),
      tableName
    );
    this.s3Service = s3Repository.getInstance(s3Name);
  }

  async uploadImage(
    imageFile: string,
    uploaderId: string,
    tags?: string | undefined
  ): Promise<ImageEntityTableItemType> {
    try {
      console.log(
        'MARTIN_LOG=> FileService -> uploadImage -> this.imageEntity.publicId',
        this.imageEntity.publicId
      );
      const response = await this.cloudinaryService.uploadImage(
        imageFile,
        this.imageEntity.publicId
      );

      const imageEntityInstance = this.imageEntity.build({
        cloudinaryUrl: response.optimizedUrl,
        uploaderId,
        tags,
      });

      console.log(
        'MARTIN_LOG=> FileService -> uploadImage -> imageEntityInstance',
        imageEntityInstance
      );

      await this.tableService.create(imageEntityInstance);

      return imageEntityInstance;
    } catch (error) {
      console.log('MARTIN_LOG=> FileService -> uploadImage -> error', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async uploadFileToS3(file: string, uploaderId: string, tags?: string) {
    // Extraer el tipo de medio y los datos del archivo de la cadena base64
    const [mediaType, base64Data] = file.split(',');

    // Extraer el tipo de archivo del tipo de medio
    const fileType = mediaType.match(/\/(.*?)$/)?.[1];
    const fileName = this.fileEntity.fileId;
    const fileKey = `${fileName}.${fileType?.split(';')[0]}`;

    const fileEntityInstance = this.fileEntity.build({
      fileName: fileKey,
      tags,
      uploaderId,
    });

    const s3Response = await this.s3Service.uploadFile(
      base64Data,
      fileKey,
      mediaType
    );

    console.log(
      'MARTIN_LOG=> FileService -> uploadFileToS3 -> fileEntityInstance',
      fileEntityInstance
    );

    await this.tableService.create(fileEntityInstance);

    console.log(
      'MARTIN_LOG=> FileService -> uploadFileToS3 -> response',
      s3Response
    );

    return fileEntityInstance;
  }

  async getFileFromS3(key: string, returnRaw = true) {
    const response = await this.tableService.query({
      query: {
        type: {
          eq: EntitiesEnum.FILE,
        },
        fileName: {
          contains: key,
        },
      },
      options: {
        using_index: TableGsiEnum.TYPE,
      },
    });

    if (!response?.length) {
      throw new Error(ErrorMessagesEnum.FILE_NOT_FOUND);
    }

    const [file] = response as FileEntityTableItemType[];

    const signedUrl = await this.s3Service.getSignedurl(`${file.fileId}.zip`);

    if (returnRaw) {
      return {
        ...file,
        signedUrl,
      };
    }

    console.log('MARTIN_LOG=> FileService -> getFile -> response', response);
    return {
      ...this.fileEntity.getClean(file),
      signedUrl,
    };
  }

  async deleteFileFromS3(key: string) {
    const response = await this.s3Service.deleteFile(key);
    console.log(
      'MARTIN_LOG=> FileService -> deleteFileFromS3 -> response',
      response
    );
    return response;
  }

  async updateFileFromS3(file: string, key: string) {
    key = key.includes('.') ? key.split('.')[0] : key;
    // Extraer el tipo de medio y los datos del archivo de la cadena base64
    const [mediaType, base64Data] = file.split(',');

    // Extraer el tipo de archivo del tipo de medio
    const fileType = mediaType.match(/\/(.*?)$/)?.[1];

    const fileKey = `${key}.${fileType?.split(';')[0]}`;

    const response = await this.s3Service.uploadFile(
      base64Data,
      fileKey,
      mediaType
    );
    console.log(
      'MARTIN_LOG=> FileService -> uploadFileToS3 -> response',
      response
    );
    return response;
  }
}
