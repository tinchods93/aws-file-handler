import { TableBasicItem } from '../../../../commons/types/commonTypes';

export type FileEntityType = {
  fileId: string;
  uploaderId: string;
  fileName: string;

  tags?: string;
};

export type FileEntityTableItemType = FileEntityType & TableBasicItem;

export type FileEntityBuilderInputType = {
  uploaderId: string;
  fileName: string;
  tags?: string;
};

export type FileEntityCleanDataType = Omit<
  FileEntityTableItemType,
  'pk' | 'sk'
>;
