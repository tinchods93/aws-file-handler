import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import depsContainer from '../../../depsContainer';
import UpdateFileAction from '../../../application/actions/filesActions/updateFileAction';

export const handler = async (command, context) => {
  const action = depsContainer.resolve(UpdateFileAction);

  const actionResponse = await commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );

  return actionResponse;
};
