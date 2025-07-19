import 'reflect-metadata';
import apiInput from 'rebased/handler/input/commandApi';
import apiOutput from 'rebased/handler/output/commandApi';
import invokeInput from 'rebased/handler/input/commandInvoke';
import invokeOutput from 'rebased/handler/output/commandInvoke';
import { commandMapper } from 'rebased/handler';
import { RemoveDTO, schema } from './schema';
import remove from '../../../../../application/actions/images/remove';
import { withValidation } from '../../withValidation';

export const handler = async (command: any, context: any) => {
  const actionPreCondition = withValidation<RemoveDTO>(schema, remove);
  let input = invokeInput;
  let output = invokeOutput;

  if (command.requestContext && command.requestContext.apiId) {
    input = apiInput;
    output = apiOutput;
  }

  return commandMapper({ command, context }, input, actionPreCondition, output);
};
