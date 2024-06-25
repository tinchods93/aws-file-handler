import { BasicEntityInterface } from '../../basicEntity/interface/basicEntityInterface';
import {
  FileEntityBuilderInputType,
  FileEntityCleanDataType,
  FileEntityTableItemType,
} from '../types/fileEntityTypes';

export const FILE_ENTITY_TOKEN = Symbol('FileEntityInterface');

export interface FileEntityInterface extends BasicEntityInterface {
  fileId: string;
  build(params: FileEntityBuilderInputType): FileEntityTableItemType;
  getClean(payload: FileEntityTableItemType): FileEntityCleanDataType;
}
