import { container } from 'tsyringe';
import { PlayHandler } from './play-handler';

import { IWillBeFamousHandler } from './i-will-be-famous-handler';

container.registerSingleton(PlayHandler);

export default [
  IWillBeFamousHandler.commandData
];
