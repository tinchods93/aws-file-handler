import { StatusCodes } from 'http-status-codes';
import depsContainer from '../../../depsContainer';
import { UploadDTO } from '../../../infrastructure/primary/handlers/files/upload/schema';
import ActionResponse from '../../entities/actionResponse';
import FileService from '../../services/fileService/fileService';

export default async function upload(uploadDTO: UploadDTO) {
  const actionResponse = new ActionResponse();
  const fileService = depsContainer.resolve(FileService);
  try {
    const response = await fileService.upload(uploadDTO);
    return actionResponse.success({
      statusCode: StatusCodes.CREATED,
      data: response,
    });
  } catch (error) {
    return actionResponse.error({
      statusCode: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      data: error,
    });
  }
}
