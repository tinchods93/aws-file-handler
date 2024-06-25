import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import depsContainer from '../../depsContainer';
import GetFileAction from '../../application/actions/getFileAction';

export const handler = async (command, context) => {
  // console.log('MARTIN_LOG=> uploadImage -> command', command);
  const action = depsContainer.resolve(GetFileAction);

  const actionResponse = await commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
  console.log('MARTIN_LOG=> uploadImage -> actionResponse', actionResponse);
  return actionResponse;
};
