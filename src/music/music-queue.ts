import { AudioPlayerError } from '@discordjs/voice';
import { singleton } from 'tsyringe';
import { MusicPlayer } from './music-player';

export class Track {
  constructor(public url: string, public name?: string) {}
}

@singleton()
export class MusicQueue {
  queue = new Array<Track>();
  nowPlayingIndex?: number;

  get nowPlaying(): Track | undefined {
    return this.nowPlayingIndex != null
      ? this.queue[this.nowPlayingIndex]
      : undefined;
  }

  constructor(private musicPlayer: MusicPlayer) {
    this.musicPlayer.events.on('song:ended', () => {
      this.playNextSong();
    });

    this.musicPlayer.events.on('audio:error', (error) => {
      if (error instanceof AudioPlayerError && error.message === 'aborted') {
        console.warn(
          'Audio played disconnected, restarting current song.',
          error
        );
        this.playCurrentSong();
      }
    });
  }

  clear() {
    this.queue = new Array<Track>();
    this.nowPlayingIndex = undefined;
    this.musicPlayer.stop();
  }

  addTracks(tracks: Track[]) {
    this.queue.push(...tracks);
    if (this.nowPlayingIndex === undefined) this.playNextSong();
  }

  playNextSong(skip = 1) {
    const skipToSong =
      this.nowPlayingIndex != null ? this.nowPlayingIndex + skip : 0;

    if (skipToSong >= this.queue.length) {
      return this.clear();
    }

    this.nowPlayingIndex = skipToSong;
    this.playCurrentSong();
  }

  private playCurrentSong() {
    this.nowPlaying && this.musicPlayer.playYoutubeVideo(this.nowPlaying.url);
  }
}
