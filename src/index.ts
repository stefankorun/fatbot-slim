import '@abraham/reflection';
import { VoiceChannel } from 'discord.js';
import { container, singleton } from 'tsyringe';
import { DiscordClient, GroobyClient } from './client';
import { CommandHandler } from './command-handler';
import { ConnectionManager } from './connection-manager';
import { MusicPlayer } from './music-player';
import { YoutubeService } from './services/youtube';

@singleton()
class App {
  constructor(
    private discordClient: DiscordClient,
    private groobyClient: GroobyClient,
    private connectionManager: ConnectionManager,
    private commandHandler: CommandHandler,
    private musicPlayer: MusicPlayer,
    private youtubeService: YoutubeService
  ) {}

  async init() {
    await this.discordClient.init();
    await this.registerHandlers();
    await this.handleMusicMessage();
  }

  /**
   * React to commands starting with '>play' in order to start playing a song.
   * @deprecated Refactor candidate.
   */
  async handleMusicMessage() {
    this.discordClient.on('messageCreate', async (message) => {
      if (message.content.startsWith('>play') === false) return;

      const voiceChannel = message?.member?.voice.channel;
      if (!(voiceChannel instanceof VoiceChannel)) {
        message.reply('Need to join a voice channel first.');
        return;
      }
      const connection = await this.connectionManager.connectToChannel(
        voiceChannel
      );

      const youtubeUrl = await this.youtubeService.parse(
        message.content.replace('>play ', '')
      );
      await this.musicPlayer.playYoutubeVideo(
        youtubeUrl ? youtubeUrl : 'https://youtube.com/watch?v=Zffe_CsJQSA'
      );

      this.musicPlayer.subscribeToConnection(connection);
    });
  }

  async registerHandlers() {
    // Register bot commands.
    const mainGuild = await this.groobyClient.getMainGuild();
    if (mainGuild) {
      await this.commandHandler.register(mainGuild);
    } else {
      console.error('Could not find Guild to attach commands to.');
    }

    // Register command and message handlers.
    this.discordClient.on(
      'interactionCreate',
      async (interaction) => await this.commandHandler.handle(interaction)
    );

    // Replay message on receive.
    this.discordClient.on('messageCreate', async (message) =>
      console.log('Received message:', message.content)
    );
  }
}

const app = container.resolve(App);
app.init();
