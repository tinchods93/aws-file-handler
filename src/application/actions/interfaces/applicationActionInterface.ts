import { HandlerCommandType } from '../../../infrastructure/primary/types/handlerTypes';

export interface ApplicationActionInterface {
  execute(
    commandPayload: HandlerCommandType,
    commandMeta?: any,
    rawMeta?: any
  ): Promise<any>;
}
