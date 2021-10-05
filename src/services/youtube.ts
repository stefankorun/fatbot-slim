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

  async searchYoutube(query: string) {
    const res = await got
      .get({
        url: `${YOUTUBE_API_URL}/search?part=snippet&maxResults=1&q=${query}&regionCode=US&type=video&videoCategoryId=10&key=${this.config.get(
          'YOUTUBE_API_KEY'
        )}`,
      })
      .json<YoutubeSearchResults>();

    return res.items[0] ? `https://youtu.be/${res.items[0].id.videoId}` : null;
  }

  async parse(candidate: string): Promise<Track> {
    // const youtubeUrlRegexMatch = candidate.match(YOUTUBE_URL_REGEX);
    // if (youtubeUrlRegexMatch != null) {
    //   return `https://${youtubeUrlRegexMatch[3]}`;
    // }

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

    let url: string | null;
    try {
      url = await this.searchYoutube(candidate);
      if (url == null) throw new Error('just go into catch');
    } catch (e) {
      throw new Error('Could not find youtube video.');
    }

    // TODO: There is a double API call here for no reason, we could easily get the data from the YT API by using, `part: snippet`
    const info = await ytdl.getInfo(url);
    return {
      name: info.videoDetails.title,
      url: info.videoDetails.video_url,
    };
  }
}

type YoutubeSearchResults = { items: Array<{ id: { videoId: string } }> };
