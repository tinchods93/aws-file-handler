import { StatusCodes } from 'http-status-codes';
import depsContainer from '../../../depsContainer';
import ActionResponse from '../../entities/actionResponse';
import FileService from '../../services/fileService/fileService';
import { RemoveDTO } from '../../../infrastructure/primary/handlers/images/remove/schema';

export default async function remove(dto: RemoveDTO) {
  const actionResponse = new ActionResponse();
  const fileService = depsContainer.resolve(FileService);
  try {
    const response = await fileService.delete(dto.id);
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
