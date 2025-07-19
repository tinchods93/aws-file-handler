import 'reflect-metadata';
import apiInput from 'rebased/handler/input/commandApi';
import apiOutput from 'rebased/handler/output/commandApi';
import invokeInput from 'rebased/handler/input/commandInvoke';
import invokeOutput from 'rebased/handler/output/commandInvoke';
import { commandMapper } from 'rebased/handler';
import upload from '../../../../../application/actions/images/upload';
import { schema, UploadDTO } from './schema';
import { withValidation } from '../../withValidation';

export const handler = async (command: any, context: any) => {
  const actionPreCondition = withValidation<UploadDTO>(schema, upload);
  let input = invokeInput;
  let output = invokeOutput;

  if (command.requestContext && command.requestContext.apiId) {
    input = apiInput;
    output = apiOutput;
  }

  return commandMapper({ command, context }, input, actionPreCondition, output);
};
