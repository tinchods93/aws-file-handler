import { StatusCodes } from 'http-status-codes';
import depsContainer from '../../../depsContainer';
import { UploadDTO } from '../../../infrastructure/primary/handlers/files/upload/schema';
import ActionResponse from '../../entities/actionResponse';
import ImageService from '../../services/imageService/imageService';

export default async function upload(uploadDTO: UploadDTO) {
  const actionResponse = new ActionResponse();
  const imageService = depsContainer.resolve(ImageService);
  try {
    const response = await imageService.upload(uploadDTO);
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
