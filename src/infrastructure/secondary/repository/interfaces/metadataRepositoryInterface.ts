import { MetadataEntity } from '../../../../domain/entities/metadata/types/metadataTypes';

export const METADATA_REPOSITORY_TOKEN = Symbol('MetadataRepositoryInterface');

export type MetadataItem = {
  pk: string;
  sk: string;
  type: string;
} & MetadataEntity;

export interface MetadataRepositoryInterface {
  store(metadata: MetadataEntity): Promise<MetadataEntity>;
  get(id: string): Promise<MetadataEntity>;
  search(params?: { query?: any }): Promise<MetadataEntity[]>;
  update(updateDTO: Partial<MetadataEntity>): Promise<MetadataItem>;
  delete(deleteDTO: { id: string; uploaderId: string }): Promise<void>;
}
