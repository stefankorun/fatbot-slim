import { container } from 'tsyringe';
import { PlayHandler } from './play-handler';

import { IWillBeFamousHandler } from './i-will-be-famous-handler';
import { StopHandler } from './stop-handler';

container.registerSingleton(PlayHandler);

export default [
  IWillBeFamousHandler.commandData,
  StopHandler.commandData
];
