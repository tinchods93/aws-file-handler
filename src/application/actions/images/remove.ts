import { StatusCodes } from 'http-status-codes';
import depsContainer from '../../../depsContainer';
import ActionResponse from '../../entities/actionResponse';
import ImageService from '../../services/imageService/imageService';
import { RemoveDTO } from '../../../infrastructure/primary/handlers/images/remove/schema';

export default async function remove(removeDTO: RemoveDTO) {
  const actionResponse = new ActionResponse();
  const imageService = depsContainer.resolve(ImageService);
  try {
    const response = await imageService.delete(removeDTO.id);
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
