import { AudioPlayerError } from '@discordjs/voice';
import { singleton } from 'tsyringe';
import { MusicSearchService } from '../services/music-search';
import { MusicPlayer } from './music-player';

export class Track {
  constructor(
    public remoteId: string,
    public url: string,
    public name?: string
  ) {}
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

  constructor(
    private musicPlayer: MusicPlayer,
    private youtubeService: MusicSearchService
  ) {
    this.musicPlayer.events.on('song:ended', () => {
      this.skipToNextSong();
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
    if (this.nowPlayingIndex === undefined) this.skipToNextSong(1);
  }

  async skipToNextSong(skip: number = 1) {
    let skipToSong =
      this.nowPlayingIndex != null ? this.nowPlayingIndex + skip : 0;

    if (skipToSong >= this.queue.length) {
      skipToSong = this.queue.length;
      await this.queueSimilarSongs();
    }

    this.nowPlayingIndex = skipToSong;
    this.playCurrentSong();
  }

  async queueSimilarSongs() {
    if (this.nowPlaying == null) return;

    const similarTracks = await this.youtubeService.searchForSimilarVideos(
      this.nowPlaying?.remoteId
    );

    this.addTracks(similarTracks.sort(() => Math.random() - 0.5).slice(0, 5));
  }

  private playCurrentSong() {
    this.nowPlaying && this.musicPlayer.playYoutubeVideo(this.nowPlaying.url);
  }
}
