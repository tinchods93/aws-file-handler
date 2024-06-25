import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import {
  ImageEntityBuilderInputType,
  ImageEntityTableItemType,
} from './types/imageEntityTypes';
import { EntitiesEnum } from '../../../commons/entitiesEnum';
import BasicEntity from '../basicEntity/basicEntity';
import { ImageEntityInterface } from './interfaces/imageEntityInterface';

export default class ImageEntity
  extends BasicEntity
  implements ImageEntityInterface
{
  pk!: string;

  sk!: string;

  type = EntitiesEnum.IMAGE;

  publicId!: string;

  uploaderId!: string;

  cloudinaryUrl!: string;

  tags?: string;

  created_at!: number;

  updated_at!: number;

  constructor() {
    super();
    this.publicId = randomUUID();
  }

  build({
    uploaderId,
    cloudinaryUrl,
    tags,
  }: ImageEntityBuilderInputType): ImageEntityTableItemType {
    this.uploaderId = uploaderId;
    this.cloudinaryUrl = cloudinaryUrl;
    this.tags = tags;
    this.pk = `${this.type}#${this.publicId}`;
    this.sk = `${this.type}#${this.publicId}`;
    this.created_at = dayjs().unix();
    this.updated_at = this.created_at;

    return {
      pk: this.pk,
      sk: this.sk,
      type: this.type,
      publicId: this.publicId,
      uploaderId: this.uploaderId,
      cloudinaryUrl: this.cloudinaryUrl,
      tags: this.tags,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
