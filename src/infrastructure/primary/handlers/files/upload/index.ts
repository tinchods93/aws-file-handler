import 'reflect-metadata';
import apiInput from 'rebased/handler/input/commandApi';
import apiOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { schema, UploadDTO } from './schema';
import upload from '../../../../../application/actions/files/upload';
import { withValidation } from '../../withValidation';

export const handler = async (command: any, context: any) => {
  const actionPreCondition = withValidation<UploadDTO>(schema, upload);

  return commandMapper(
    { command, context },
    apiInput,
    actionPreCondition,
    apiOutput
  );
};
