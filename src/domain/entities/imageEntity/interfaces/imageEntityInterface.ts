import { BasicEntityInterface } from '../../basicEntity/interface/basicEntityInterface';
import {
  ImageEntityBuilderInputType,
  ImageEntityTableItemType,
} from '../types/imageEntityTypes';

export const IMAGE_ENTITY_TOKEN = Symbol('ImageEntityInterface');

export interface ImageEntityInterface extends BasicEntityInterface {
  publicId: string;
  build(params: ImageEntityBuilderInputType): ImageEntityTableItemType;
}
