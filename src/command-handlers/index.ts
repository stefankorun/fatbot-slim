import { PlayHandler } from './play-handler';
import { SkipSongHandler } from './skip-song-handler';
import { StopHandler } from './stop-handler';
import { ShowQueueHandler } from './show-queue';

export default [
  PlayHandler.commandData,
  ShowQueueHandler.commandData,
  StopHandler.commandData,
  SkipSongHandler.commandData,
];
