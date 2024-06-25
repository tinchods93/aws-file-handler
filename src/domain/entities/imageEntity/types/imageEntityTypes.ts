import { TableBasicItem } from '../../../../commons/types/commonTypes';

export type ImageEntityType = {
  publicId: string;
  uploaderId: string;
  cloudinaryUrl: string;
  tags?: string;
};

export type ImageEntityTableItemType = ImageEntityType & TableBasicItem;

export type ImageEntityBuilderInputType = {
  uploaderId: string;
  cloudinaryUrl: string;
  tags?: string;
};
