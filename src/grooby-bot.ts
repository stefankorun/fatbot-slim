import { GuildMember, VoiceChannel } from 'discord.js';
import { singleton } from 'tsyringe';
import { ConnectionManager } from './connection-manager';
import { DiscordClient } from './discord-client';
import { MusicPlayer } from './music-player';
import { MusicQueue, Track } from './music-queue';
import { YoutubeService } from './services/youtube';

@singleton()
export class GroobyBot {
  constructor(
    private discordClient: DiscordClient,
    private youtubeService: YoutubeService,
    private connectionManager: ConnectionManager,
    private musicQueue: MusicQueue,
    private musicPlayer: MusicPlayer
  ) {}

  async connectToMemberVoiceChannel(member: GuildMember) {
    const voiceChannel = member?.voice.channel;

    if (!(voiceChannel instanceof VoiceChannel)) {
      return null;
    }
    const connection = await this.connectionManager.connectToChannel(
      voiceChannel
    );
    this.musicPlayer.subscribeToConnection(connection);
    return connection;
  }

  async queueSong(query: string) {
    const youtubeUrl = await this.youtubeService.parse(query);

    this.musicQueue.push(
      new Track(
        youtubeUrl ? youtubeUrl : 'https://youtube.com/watch?v=Zffe_CsJQSA'
      )
    );
  }

  /**
   * Flaky logic for getting the main "Guild" on the server.
   * @returns The first Guild found on the server.
   */
  async getMainGuild() {
    return this.discordClient.guilds.cache.first();
  }
}
