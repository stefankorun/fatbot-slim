import { singleton } from 'tsyringe';
import { MusicPlayer } from './music-player';

export class Track {
  constructor(public url: string, public name?: string) {}
}

@singleton()
export class MusicQueue {
  queue = new Array<Track>();
  nowPlaying?: Track;

  constructor(private musicPlayer: MusicPlayer) {
    this.musicPlayer.songEndedCallback = () => {
      this.nowPlaying = undefined;
      this.updateQueue();
    };
  }

  push(track: Track) {
    this.queue.push(track);
    this.updateQueue();
  }

  updateQueue() {
    if (this.queue.length === 0) return this.musicPlayer.disconnect();

    if (this.nowPlaying == null) {
      console.log('Playing next song');
      this.nowPlaying = this.queue.shift();
      this.nowPlaying && this.musicPlayer.playYoutubeVideo(this.nowPlaying.url);
    }
  }
}
