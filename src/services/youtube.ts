import got from 'got';
import { singleton } from 'tsyringe';
import ytdl from 'ytdl-core';
import { Track } from '../music-queue';
import { ConfigurationService } from './configuration';

const DUMB_URL_REGEX = /(https?:\/\/)|(www\.)([\w-\?\.])+$/;
const YOUTUBE_URL_REGEX =
  /(https?\:\/\/)?(www\.)?((youtube\.com|youtu\.be)\/.+)$/;

const YOUTUBE_API_URL = 'https://youtube.googleapis.com/youtube/v3';

@singleton()
export class YoutubeService {
  constructor(private config: ConfigurationService) {}

  async searchYoutube(query: string): Promise<Track> {
    const res = await got
      .get({
        url: `${YOUTUBE_API_URL}/search?part=snippet&maxResults=1&q=${query}&regionCode=US&type=video&videoCategoryId=10&key=${this.config.get(
          'YOUTUBE_API_KEY'
        )}`,
      })
      .json<YoutubeSearchResults>();

    const searchResult = res.items[0];
    if (searchResult == null) throw new Error('No results from youtube API');

    return new Track(
      `https://youtu.be/${searchResult.id.videoId}`,
      searchResult.snippet.title
    );
  }

  async parse(candidate: string): Promise<Track> {
    if (ytdl.validateURL(candidate)) {
      const info = await ytdl.getInfo(candidate);
      return {
        name: info.videoDetails.title,
        url: info.videoDetails.video_url,
      };
    }

    const dumbUrlRegexMatch = candidate.match(DUMB_URL_REGEX);
    if (dumbUrlRegexMatch != null) {
      throw new Error('Working only with youtube urls at the moment.');
    }

    return await this.searchYoutube(candidate);
  }
}

type YoutubeSearchResults = {
  items: Array<{ id: { videoId: string }; snippet: { title: string } }>;
};
