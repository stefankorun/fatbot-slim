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
import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import ytdl from 'ytdl-core';

@singleton()
export class MusicPlayer {
  static AudioPlayer = createAudioPlayer();
  currentSubscription?: PlayerSubscription;

  public events = new EventEmitter();

  constructor() {
    MusicPlayer.AudioPlayer.on('stateChange', (oldState, newState) => {
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        console.log('Song ended!');
        this.events.emit('song:ended');
      }
    });

    MusicPlayer.AudioPlayer.on(
      'error',
      async (error) => (this.events.emit('audio:error', error), void 0)
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
    // `ytdl` settings taken from https://github.com/fent/node-ytdl-core/issues/902#issuecomment-1086880966
    const stream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0,
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
