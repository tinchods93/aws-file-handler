import 'reflect-metadata';
import apiInput from 'rebased/handler/input/commandApi';
import apiOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { RemoveDTO, schema } from './schema';
import remove from '../../../../../application/actions/files/remove';
import { withValidation } from '../../withValidation';

export const handler = async (command: any, context: any) => {
  const actionPreCondition = withValidation<RemoveDTO>(schema, remove);

  return commandMapper(
    { command, context },
    apiInput,
    actionPreCondition,
    apiOutput
  );
};
