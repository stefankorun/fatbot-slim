import {
  Client as DiscordClientBase,
  GuildMember,
  Intents,
  VoiceChannel,
} from 'discord.js';
import { singleton } from 'tsyringe';
import { ConfigurationService } from './services/configuration';
import { YoutubeService } from './services/youtube';
import { MusicQueue, Track } from './music-queue';
import { ConnectionManager } from './connection-manager';
import { MusicPlayer } from './music-player';

@singleton()
export class DiscordClient extends DiscordClientBase {
  constructor(private configService: ConfigurationService) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
      ],
    });
  }

  async init() {
    await this.login(this.configService.get('DISCORD_TOKEN'));

    this.on('ready', () => {
      console.log(`Logged in as ${this?.user?.tag}!`);
    });
  }
}

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

  async addToQueue(query: string) {
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
