import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { MetadataDTO, MetadataEntity } from './types/metadataTypes';

export default class Metadata implements MetadataEntity {
  id: string;

  uploaderId: string;

  uri?: string;

  creation_date: string;

  updated_at: string;

  tags?: string;

  constructor(dto: MetadataDTO) {
    this.id = randomUUID();
    this.uploaderId = dto.uploaderId;
    this.uri = dto.uri;
    this.creation_date = dayjs().toString();
    this.updated_at = this.creation_date;
    this.tags = dto.tags;
  }

  get() {
    return this;
  }
}
