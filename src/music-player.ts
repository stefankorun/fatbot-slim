import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  VoiceConnection,
} from '@discordjs/voice';
import { singleton } from 'tsyringe';
import ytdl from 'ytdl-core';

@singleton()
export class MusicPlayer {
  static AudioPlayer = createAudioPlayer();

  subscribeToConnection(connection: VoiceConnection) {
    connection.subscribe(MusicPlayer.AudioPlayer);
  }

  playYoutubeVideo(url: string) {
    const stream = ytdl(url, {
      filter: 'audioonly',
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    MusicPlayer.AudioPlayer.play(resource);
    return entersState(MusicPlayer.AudioPlayer, AudioPlayerStatus.Playing, 5e3);
  }
}
