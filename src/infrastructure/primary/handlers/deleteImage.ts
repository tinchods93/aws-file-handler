import 'reflect-metadata';
import apiInput from 'rebased/handler/input/commandApi';
import apiOutput from 'rebased/handler/output/commandApi';
import commandInput from 'rebased/handler/input/commandInvoke';
import commandOutput from 'rebased/handler/output/commandInvoke';
import { commandMapper } from 'rebased/handler';
import depsContainer from '../../../depsContainer';
import { HandlerCommandType } from '../types/handlerTypes';
import DeleteImageAction from '../../../application/actions/imagesActions/deleteImageAction';

export const handler = async (command: HandlerCommandType, context: any) => {
  const action = depsContainer.resolve(DeleteImageAction);

  if (command.requestContext?.apiId) {
    return commandMapper(
      { command, context },
      apiInput,
      action.execute,
      apiOutput
    );
  }

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
