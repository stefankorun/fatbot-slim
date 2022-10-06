import {
  DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { GuildMember, VoiceChannel } from 'discord.js';
import { singleton } from 'tsyringe';
import { DiscordClient } from './discord-client';
import { MusicPlayer } from './music-player';
import { MusicQueue } from './music-queue';
import { YoutubeService } from './services/youtube';

@singleton()
export class GroobyBot {
  constructor(
    private discordClient: DiscordClient,
    private youtubeService: YoutubeService,
    private musicQueue: MusicQueue,
    private musicPlayer: MusicPlayer
  ) {}

  async connectToChannel(channel: VoiceChannel) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
      return connection;
    } catch (error) {
      connection.destroy();
      throw error;
    }
  }

  async connectToMemberVoiceChannel(member: GuildMember) {
    const voiceChannel = member?.voice.channel;

    if (!(voiceChannel instanceof VoiceChannel)) {
      return null;
    }
    const connection = await this.connectToChannel(voiceChannel);
    this.musicPlayer.subscribeToConnection(connection);
    return connection;
  }

  async queueSong(query: string) {
    const youtubeTracks = await this.youtubeService.parse(query);

    this.musicQueue.addTracks(youtubeTracks);

    return youtubeTracks;
  }

  /**
   * Flaky logic for getting the main "Guild" on the server.
   * @returns The first Guild found on the server.
   */
  async getMainGuild() {
    return (await this.discordClient.guilds.fetch()).first()?.fetch();
  }
}
