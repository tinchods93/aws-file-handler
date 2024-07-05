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
import { getFileInputSchema } from '../../schemas/zodSchemas/getFileInputSchema';

@injectable()
export default class GetFileAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(FILE_REPOSITORY_TOKEN)
    private fileRepository: FileRepositoryInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(getFileInputSchema).validate(
        commandPayload.parameters
      );

      console.log('MARTIN_LOG=> payload', payload);
      const response = await this.fileRepository.getFile(payload);
      console.log(
        'MARTIN_LOG=> UploadFileAction -> execute -> response',
        response
      );
      return this.actionResponse.success({
        statusCode: StatusCodes.OK,
        data: response,
      });
    } catch (error) {
      console.log('MARTIN_LOG=> UploadFileAction -> execute -> error', error);
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
