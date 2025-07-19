import { UploadDTO } from '../../../../infrastructure/primary/handlers/files/upload/schema';

export type MetadataDTO = Omit<UploadDTO, 'file'> & {
  uri?: string;
};

export type MetadataEntity = MetadataDTO & {
  id: string;
  creation_date: string;
  updated_at: string;
};
