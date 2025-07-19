import 'reflect-metadata';
import apiInput from 'rebased/handler/input/commandApi';
import apiOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { GetDTO, schema } from './schema';
import get from '../../../../../application/actions/files/get';
import { withValidation } from '../../withValidation';

export const handler = async (command: any, context: any) => {
  const actionPreCondition = withValidation<GetDTO>(schema, get);

  return commandMapper(
    { command, context },
    apiInput,
    actionPreCondition,
    apiOutput
  );
};
