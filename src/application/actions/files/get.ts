import { StatusCodes } from 'http-status-codes';
import depsContainer from '../../../depsContainer';
import ActionResponse from '../../entities/actionResponse';
import FileService from '../../services/fileService/fileService';
import { GetDTO } from '../../../infrastructure/primary/handlers/files/get/schema';

export default async function get(dto: GetDTO) {
  const actionResponse = new ActionResponse();
  const fileService = depsContainer.resolve(FileService);
  try {
    const response = await fileService.get(dto.id);
    return actionResponse.success({
      statusCode: StatusCodes.OK,
      data: response,
    });
  } catch (error) {
    return actionResponse.error({
      statusCode: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      data: error,
    });
  }
}
