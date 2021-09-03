import { IWillBeFamousHandler } from './i-will-be-famous-handler';
import { PauseHandler } from './pause-handler';
import { PlayHandler } from './play-handler';
import { ResumeHandler } from './resume-handler';
import { SkipSongHandler } from './skip-song-handler';
import { StopHandler } from './stop-handler';
import { container } from 'tsyringe';
import { QueueSongHandler } from './queue-song-handler';
import { QueueVmroAnthemHandler } from './queue-vmro-anthem-handler';
import { PlayCommandProcessor } from './play-command-processor';

export default [
  IWillBeFamousHandler.commandData,
  StopHandler.commandData,
  SkipSongHandler.commandData,
  PlayHandler.commandData,
  PauseHandler.commandData,
  ResumeHandler.commandData,
];

// TODO refactor
container.registerSingleton(QueueSongHandler);
container.registerSingleton(QueueVmroAnthemHandler);
container.registerSingleton(PlayCommandProcessor);
