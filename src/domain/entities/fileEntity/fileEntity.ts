import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import {
  FileEntityBuilderInputType,
  FileEntityCleanDataType,
  FileEntityTableItemType,
} from './types/fileEntityTypes';
import { EntitiesEnum } from '../../../commons/entitiesEnum';
import BasicEntity from '../basicEntity/basicEntity';
import { FileEntityInterface } from './interfaces/fileEntityInterface';

export default class FileEntity
  extends BasicEntity
  implements FileEntityInterface
{
  pk!: string;

  sk!: string;

  type = EntitiesEnum.FILE;

  fileId!: string;

  uploaderId!: string;

  fileName!: string;

  tags?: string;

  created_at!: number;

  updated_at!: number;

  url!: string;

  constructor() {
    super();
    this.fileId = randomUUID();
  }

  build({
    uploaderId,
    tags,
  }: FileEntityBuilderInputType): FileEntityTableItemType {
    this.uploaderId = uploaderId;
    this.tags = tags;
    this.fileName = this.fileId;
    this.pk = `${this.type}#${this.fileId}`;
    this.sk = `UPLOADER#${this.uploaderId}`;
    this.created_at = dayjs().unix();
    this.updated_at = this.created_at;

    return {
      pk: this.pk,
      sk: this.sk,
      type: this.type,
      fileId: this.fileId,
      uploaderId: this.uploaderId,
      fileName: this.fileName,
      tags: this.tags,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  getClean(payload: FileEntityTableItemType): FileEntityCleanDataType {
    return {
      type: payload.type,
      fileId: payload.fileId,
      uploaderId: payload.uploaderId,
      fileName: payload.fileName,
      tags: payload.tags,
      created_at: payload.created_at,
      updated_at: payload.updated_at,
    };
  }
}
