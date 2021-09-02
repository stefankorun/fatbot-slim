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

    // FIXME: Potential infinite loop,
    // when sending invalid resource instead of handling network error.
    this.musicPlayer.audioPlayerErrorCallback = (error) => {
      console.log('Trying to restore music after audio disconnect.', error);
      this.musicPlayer.currentSubscription?.player.play(error.resource);
    };
  }

  push(track: Track) {
    this.queue.push(track);
    this.updateQueue();
  }

  updateQueue() {
    if (this.size() === 0) return this.musicPlayer.disconnect();

    if (this.nowPlaying == null) {
      console.log('Playing next song');
      this.playNext();
    }
  }

  clear() {
    this.queue = new Array<Track>();
    this.nowPlaying = undefined;
    this.musicPlayer.stop();
    this.musicPlayer.disconnect();
  }

  skip(count = 1) {
    if (this.size() > 0 && count <= this.size()) {
      this.queue = this.queue.slice(count - 1, this.size());
      this.playNext();
    }
  }

  private size() {
    return this.queue.length;
  }

  private playNext() {
    this.nowPlaying = this.queue.shift();
    this.nowPlaying && this.musicPlayer.playYoutubeVideo(this.nowPlaying.url);
  }
}
