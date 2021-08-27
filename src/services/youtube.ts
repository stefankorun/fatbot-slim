import { singleton } from 'tsyringe';
import got from 'got';
import { ConfigurationService } from './configuration';

const DUMB_URL_REGEX = /(https?:\/\/)|(www\.)([\w-\?\.])+$/;
const YOUTUBE_URL_REGEX =
  /(https?\:\/\/)?(www\.)?((youtube\.com|youtu\.be)\/.+)$/;

const YOUTUBE_API_URL = 'https://youtube.googleapis.com/youtube/v3/';

@singleton()
export class YoutubeService {
  constructor(private config: ConfigurationService) {}

  async searchYoutube(query: string) {
    const res = await got
      .get({
        url: `${YOUTUBE_API_URL}search?part=snippet&maxResults=25&q=${query}&regionCode=US&type=video&videoCategoryId=10&key=${this.config.get(
          'YOUTUBE_API_KEY'
        )}`,
        headers: {
          Accept: 'application/json',
        },
      })
      .json<YoutubeSearchResults>();

    return res.items[0] ? `https://youtu.be/${res.items[0].id.videoId}` : null;
  }

  async parse(candidate: string) {
    const youtubeUrlRegexMatch = candidate.match(YOUTUBE_URL_REGEX);
    if (youtubeUrlRegexMatch != null) {
      return `https://${youtubeUrlRegexMatch[3]}`;
    }

    const dumbUrlRegexMatch = candidate.match(DUMB_URL_REGEX);
    if (dumbUrlRegexMatch != null) {
      throw new Error('Working only with youtube urls at the moment.');
    }

    try {
      return this.searchYoutube(candidate);
    } catch (e) {
      throw new Error('Could not find youtube video.');
    }
  }
}

type YoutubeSearchResults = { items: Array<{ id: { videoId: string } }> };
