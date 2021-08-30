import { IWillBeFamousHandler } from './i-will-be-famous-handler';
import { PlayHandler } from './play-handler';
import { SkipSongHandler } from './skip-song-handler';
import { StopHandler } from './stop-handler';

export default [
  IWillBeFamousHandler.commandData,
  StopHandler.commandData,
  SkipSongHandler.commandData,
  PlayHandler.commandData,
];
