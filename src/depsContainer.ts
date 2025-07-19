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
  METADATA_REPOSITORY_TOKEN,
  MetadataRepositoryInterface,
} from './infrastructure/secondary/repository/interfaces/metadataRepositoryInterface';
import MetadataRepository from './infrastructure/secondary/repository/metadataRepository';

//infrastructure ############################################################################################################
depsContainer.register<MetadataRepositoryInterface>(METADATA_REPOSITORY_TOKEN, {
  useClass: MetadataRepository,
});
depsContainer.register<TableRepositoryInterface>(TABLE_REPOSITORY_TOKEN, {
  useClass: TableRepository,
});
depsContainer.register<TableServiceInterface>(TABLE_SERVICE_TOKEN, {
  useClass: TableService,
});
depsContainer.register<CloudinaryServiceInterface>(CLOUDINARY_SERVICE_TOKEN, {
  useClass: CloudinaryService,
});
depsContainer.register<S3ServiceInterface>(S3_SERVICE_TOKEN, {
  useClass: S3Service,
});

export default depsContainer;
