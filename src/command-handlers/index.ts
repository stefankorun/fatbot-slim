import { IWillBeFamousHandler } from './i-will-be-famous-handler';
import { TruthCountHandler } from './truth-count-handler';
import { PauseHandler } from './pause-handler';
import { PlayHandler } from './play-handler';
import { ResumeHandler } from './resume-handler';
import { SkipSongHandler } from './skip-song-handler';
import { StopHandler } from './stop-handler';

export default [
  IWillBeFamousHandler.commandData,
  TruthCountHandler.commandData,
  StopHandler.commandData,
  SkipSongHandler.commandData,
  PlayHandler.commandData,
  PauseHandler.commandData,
  ResumeHandler.commandData,
];
