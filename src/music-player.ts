import {
  AudioPlayerError,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  PlayerSubscription,
  StreamType,
  VoiceConnection,
} from '@discordjs/voice';
import { singleton } from 'tsyringe';
import ytdl from 'ytdl-core';

@singleton()
export class MusicPlayer {
  static AudioPlayer = createAudioPlayer();
  currentSubscription?: PlayerSubscription;

  /** Refactor events to a better EventEmitter structure */
  public songEndedCallback?: () => void;
  public audioPlayerErrorCallback?: (error: AudioPlayerError) => void;

  constructor() {
    MusicPlayer.AudioPlayer.on('stateChange', (oldState, newState) => {
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        console.log('Song ended!');
        this.songEndedCallback?.();
      }
    });

    MusicPlayer.AudioPlayer.on('error', (error) =>
      this.audioPlayerErrorCallback?.(error)
    );
  }

  disconnect() {
    this.currentSubscription?.connection.destroy();
    this.currentSubscription = undefined;
  }

  subscribeToConnection(connection: VoiceConnection) {
    this.currentSubscription = connection.subscribe(MusicPlayer.AudioPlayer);
  }

  playYoutubeVideo(url: string) {
    const stream = ytdl(url, {
      filter: 'audioonly',
      quality: 'lowestaudio',
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    MusicPlayer.AudioPlayer.play(resource);
    return entersState(MusicPlayer.AudioPlayer, AudioPlayerStatus.Playing, 5e3);
  }

  stop() {
    MusicPlayer.AudioPlayer.stop();
  }

  pause() {
    MusicPlayer.AudioPlayer.pause();
  }

  resume() {
    MusicPlayer.AudioPlayer.unpause();
  }
}
