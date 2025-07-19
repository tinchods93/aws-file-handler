import { inject, injectable } from 'tsyringe';
import {
  METADATA_REPOSITORY_TOKEN,
  MetadataRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/metadataRepositoryInterface';
import {
  CLOUDINARY_SERVICE_TOKEN,
  CloudinaryServiceInterface,
} from '../../../infrastructure/secondary/services/interface/cloudinaryServiceInterface';
import { UploadDTO } from '../../../infrastructure/primary/handlers/files/upload/schema';
import Metadata from '../../../domain/entities/metadata/metadata';

@injectable()
export default class ImageService {
  constructor(
    @inject(CLOUDINARY_SERVICE_TOKEN)
    private cloudinaryService: CloudinaryServiceInterface,
    @inject(METADATA_REPOSITORY_TOKEN)
    private metadataRepository: MetadataRepositoryInterface
  ) {}

  async upload(uploadDTO: UploadDTO) {
    const metadata = new Metadata({
      uploaderId: uploadDTO.uploaderId,
      tags: uploadDTO.tags,
    });

    metadata.uri = this.cloudinaryService.getUri(metadata.id);

    await Promise.all([
      this.metadataRepository.store(metadata.get()),
      this.cloudinaryService.upload({
        file: uploadDTO.file,
        id: metadata.id,
      }),
    ]);

    return metadata.get();
  }

  async delete(id: string): Promise<any> {
    const metadata = await this.metadataRepository.get(id);
    const isDeleted = await this.cloudinaryService.delete(id);

    if (!isDeleted) {
      throw new Error('Image deletion failed');
    }

    await this.metadataRepository.delete({
      id,
      uploaderId: metadata.uploaderId,
    });

    return {
      success: true,
      message: 'Image deleted successfully',
    };
  }

  async get(id: string) {
    const metadata = await this.metadataRepository.get(id);

    if (!metadata) {
      throw new Error('Metadata not found');
    }

    const uri = this.cloudinaryService.getUri(id);

    return {
      ...metadata,
      uri,
    };
  }
}
