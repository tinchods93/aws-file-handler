// import container from tsyringe and declare all dependencies for injection
import { container as depsContainer } from 'tsyringe';
import TableService from './infrastructure/secondary/services/tableService';
import {
  TABLE_SERVICE_TOKEN,
  TableServiceInterface,
} from './infrastructure/secondary/services/interface/tableServiceInterface';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from './infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import TableRepository from './infrastructure/secondary/repository/tableRepository';
import {
  IMAGE_ENTITY_TOKEN,
  ImageEntityInterface,
} from './domain/entities/imageEntity/interfaces/imageEntityInterface';
import ImageEntity from './domain/entities/imageEntity/imageEntity';
import {
  FILE_SERVICE_TOKEN,
  FileServiceInterface,
} from './domain/services/interfaces/fileServiceInterface';
import FileService from './domain/services/fileService';
import {
  FILE_REPOSITORY_TOKEN,
  FileRepositoryInterface,
} from './application/repositories/interfaces/fileRepositoryInterface';
import FileRepository from './application/repositories/fileRepository';
import CloudinaryService from './infrastructure/secondary/services/cloudinaryService';
import {
  CLOUDINARY_SERVICE_TOKEN,
  CloudinaryServiceInterface,
} from './infrastructure/secondary/services/interface/cloudinaryServiceInterface';
import {
  S3ServiceInterface,
  S3_SERVICE_TOKEN,
} from './infrastructure/secondary/services/interface/s3ServiceInterface';
import S3Service from './infrastructure/secondary/services/s3Service';
import {
  S3RepositoryInterface,
  S3_REPOSITORY_TOKEN,
} from './infrastructure/secondary/repository/interfaces/s3RepositoryInterface';
import S3Repository from './infrastructure/secondary/repository/s3Repository';
import {
  FILE_ENTITY_TOKEN,
  FileEntityInterface,
} from './domain/entities/fileEntity/interfaces/fileEntityInterface';
import FileEntity from './domain/entities/fileEntity/fileEntity';

// application ############################################################################################################

// repositories
depsContainer.register<FileRepositoryInterface>(FILE_REPOSITORY_TOKEN, {
  useClass: FileRepository,
});

// domain ############################################################################################################
// entities
depsContainer.register<ImageEntityInterface>(IMAGE_ENTITY_TOKEN, {
  useClass: ImageEntity,
});
depsContainer.register<FileEntityInterface>(FILE_ENTITY_TOKEN, {
  useClass: FileEntity,
});
// repositories
depsContainer.register<FileServiceInterface>(FILE_SERVICE_TOKEN, {
  useClass: FileService,
});

//infrastructure ############################################################################################################
depsContainer.register<TableServiceInterface>(TABLE_SERVICE_TOKEN, {
  useClass: TableService,
});
depsContainer.register<TableRepositoryInterface>(TABLE_REPOSITORY_TOKEN, {
  useClass: TableRepository,
});
depsContainer.register<CloudinaryServiceInterface>(CLOUDINARY_SERVICE_TOKEN, {
  useClass: CloudinaryService,
});
depsContainer.register<S3ServiceInterface>(S3_SERVICE_TOKEN, {
  useClass: S3Service,
});
depsContainer.register<S3RepositoryInterface>(S3_REPOSITORY_TOKEN, {
  useClass: S3Repository,
});

export default depsContainer;
