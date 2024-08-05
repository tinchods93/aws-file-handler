import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import ActionResponse from '../../entities/actionResponse';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import {
  FILE_REPOSITORY_TOKEN,
  FileRepositoryInterface,
} from '../../repositories/interfaces/fileRepositoryInterface';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import { HandlerCommandType } from '../../../infrastructure/primary/types/handlerTypes';
import { updateFileInputSchema } from '../../schemas/zodSchemas/updateFileInputSchema';

@injectable()
export default class UpdateFileAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(FILE_REPOSITORY_TOKEN)
    private fileRepository: FileRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(updateFileInputSchema).validate({
        ...commandPayload.parameters,
        ...commandPayload.body,
      });

      const response = await this.fileRepository.updateFile(payload);

      return this.actionResponse.success({
        statusCode: StatusCodes.CREATED,
        data: {
          message: 'File Updated successfully',
          ...response,
        },
      });
    } catch (error) {
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
