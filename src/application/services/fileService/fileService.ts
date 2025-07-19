import { inject, injectable } from 'tsyringe';
import {
  METADATA_REPOSITORY_TOKEN,
  MetadataRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/metadataRepositoryInterface';

import Metadata from '../../../domain/entities/metadata/metadata';
import {
  S3_SERVICE_TOKEN,
  S3ServiceInterface,
} from '../../../infrastructure/secondary/services/interface/s3ServiceInterface';
import { UploadDTO } from '../../../infrastructure/primary/handlers/files/upload/schema';

@injectable()
export default class FileService {
  constructor(
    @inject(METADATA_REPOSITORY_TOKEN)
    private metadataRepository: MetadataRepositoryInterface,
    @inject(S3_SERVICE_TOKEN) private s3Repository: S3ServiceInterface
  ) {}

  async upload(uploadDTO: UploadDTO) {
    const metadata = new Metadata({
      uploaderId: uploadDTO.uploaderId,
      tags: uploadDTO.tags,
    });

    await Promise.all([
      this.metadataRepository.store(metadata),
      this.s3Repository.upload({
        file: uploadDTO.file,
        id: metadata.id,
      }),
    ]);

    return metadata.get();
  }

  async get(id: string) {
    const metadata = await this.metadataRepository.get(id);

    if (!metadata) {
      throw new Error('Metadata not found');
    }
    const uri = await this.s3Repository.getSignedUrl(id);

    return {
      ...metadata,
      uri,
    };
  }

  async delete(id: string) {
    const metadata = await this.metadataRepository.get(id);

    if (!metadata) {
      throw new Error('Metadata not found');
    }

    await Promise.all([
      this.metadataRepository.delete({
        id: metadata.id,
        uploaderId: metadata.uploaderId,
      }),
      this.s3Repository.delete(metadata.id),
    ]);
    return { success: true, message: 'File deleted successfully' };
  }
}
