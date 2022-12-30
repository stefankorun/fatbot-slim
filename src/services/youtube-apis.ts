import { youtube, type youtube_v3 } from '@googleapis/youtube';
import { singleton } from 'tsyringe';
import { ConfigurationService } from './configuration';

@singleton()
export class YoutubeAPIService {
  sdk: youtube_v3.Youtube;

  constructor(private config: ConfigurationService) {
    this.sdk = youtube({
      version: 'v3',
      key: this.config.get('YOUTUBE_API_KEY'),
    });
  }

  async search(q: string): Promise<youtube_v3.Schema$SearchListResponse> {
    const result = await this.sdk.search.list({
      q,
      maxResults: 1,
      videoCategoryId: '10',
      part: ['snippet'],
      regionCode: 'MK',
      type: ['video'],
      key: this.config.get('YOUTUBE_API_KEY'),
    });

    return result.data;
  }

  async getRelatedVideos(
    videoId: string
  ): Promise<youtube_v3.Schema$SearchListResponse> {
    const result = await this.sdk.search.list({
      relatedToVideoId: videoId,
      maxResults: 10,
      videoCategoryId: '10',
      part: ['snippet'],
      regionCode: 'MK',
      type: ['video'],
      key: this.config.get('YOUTUBE_API_KEY'),
    });

    return result.data;
  }
}
