import { COMMAND_HANDLER_TOKEN_PREFIX } from './constants';

export const commandHandlerToken = (commandType: string) =>
  `${COMMAND_HANDLER_TOKEN_PREFIX}/${commandType}`;
