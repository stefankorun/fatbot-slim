import { type youtube_v3 } from '@googleapis/youtube';
import { singleton } from 'tsyringe';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import { Track } from '../music/music-queue';
import { YoutubeAPIService } from './youtube-apis';

const DUMB_URL_REGEX = /(https?:\/\/)|(www\.)([\w-\?\.])+$/;

const YOUTUBE_API_URL = 'https://youtube.googleapis.com/youtube/v3';

@singleton()
export class MusicSearchService {
  constructor(private youtubeAPI: YoutubeAPIService) {}

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
    const res = await this.youtubeAPI.getRelatedVideos(videoId);

    return res.items?.map(youtubeSearchResultToTrack) ?? [];
  }

  private async searchForVideo(query: string): Promise<Track | undefined> {
    const res = await this.youtubeAPI.search(query);
    const searchResult = res.items?.[0];

    return searchResult && youtubeSearchResultToTrack(searchResult);
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

function youtubeSearchResultToTrack(
  searchResult: youtube_v3.Schema$SearchResult
): Track {
  if (!searchResult.id?.videoId || !searchResult.snippet?.title)
    throw new Error('Cannot parse YouTube SearchResult to Track');

  return {
    remoteId: searchResult.id.videoId,
    name: searchResult.snippet.title,
    url: `https://youtu.be/${searchResult.id.videoId}`,
  };
}

type YoutubeSearchResults = {
  items: Array<{ id: { videoId: string }; snippet: { title: string } }>;
};
