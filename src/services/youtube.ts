import got from 'got';
import { singleton } from 'tsyringe';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import { Track } from '../music/music-queue';
import { ConfigurationService } from './configuration';

const DUMB_URL_REGEX = /(https?:\/\/)|(www\.)([\w-\?\.])+$/;

const YOUTUBE_API_URL = 'https://youtube.googleapis.com/youtube/v3';

@singleton()
export class YoutubeService {
  constructor(private config: ConfigurationService) {}

  private playlistToTracks(playlist: ytpl.Result): Track[] {
    return playlist.items.map((item) => {
      return {
        remoteId: item.id,
        name: item.title,
        url: item.shortUrl,
      };
    });
  }

  async searchForSimilarVideos(videoId: string): Promise<Track[]> {
    const res = await got
      .get({
        url: `${YOUTUBE_API_URL}/search?part=snippet&maxResults=3&relatedToVideoId=${videoId}&regionCode=US&type=video&videoCategoryId=10&key=${this.config.get(
          'YOUTUBE_API_KEY'
        )}`,
      })
      .json<YoutubeSearchResults>();

    return res.items.map((searchResult) => ({
      remoteId: searchResult.id.videoId,
      name: searchResult.snippet.title,
      url: `https://youtu.be/${searchResult.id.videoId}`,
    }));
  }

  private async searchForVideo(query: string): Promise<Track | undefined> {
    const res = await got
      .get({
        url: `${YOUTUBE_API_URL}/search?part=snippet&maxResults=1&q=${query}&regionCode=US&type=video&videoCategoryId=10&key=${this.config.get(
          'YOUTUBE_API_KEY'
        )}`,
      })
      .json<YoutubeSearchResults>();

    const searchResult = res.items[0];

    return (
      searchResult && {
        remoteId: searchResult.id.videoId,
        name: searchResult.snippet.title,
        url: `https://youtu.be/${searchResult.id.videoId}`,
      }
    );
  }

  async parse(candidate: string): Promise<Track[]> {
    if (ytpl.validateID(candidate)) {
      const playlistData = await ytpl(candidate, {
        limit: 15,
      });

      return this.playlistToTracks(playlistData);
    }

    if (ytdl.validateURL(candidate)) {
      const info = await ytdl.getInfo(candidate);
      return [
        {
          remoteId: info.videoDetails.videoId,
          name: info.videoDetails.title,
          url: info.videoDetails.video_url,
        },
      ];
    }

    if (candidate.match(DUMB_URL_REGEX) == null) {
      const nextSong = await this.searchForVideo(candidate);
      return nextSong ? [nextSong] : [];
    }

    throw new Error('Working only with Youtube urls at the moment.');
  }
}

type YoutubeSearchResults = {
  items: Array<{ id: { videoId: string }; snippet: { title: string } }>;
};
