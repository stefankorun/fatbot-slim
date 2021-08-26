import '@abraham/reflection';
import { VoiceChannel } from 'discord.js';
import { container, singleton } from 'tsyringe';
import { DiscordClient, GroobyClient } from './src/client';
import { CommandHandler } from './src/command-handler';
import { ConnectionManager } from './src/connection-manager';
import { MusicPlayer } from './src/music-player';

@singleton()
class App {
  constructor(
    private discordClient: DiscordClient,
    private groobyClient: GroobyClient,
    private connectionManager: ConnectionManager,
    private musicPlayer: MusicPlayer,
    private commandHandler: CommandHandler
  ) {}

  async init() {
    // Initialize Discord client.
    await this.discordClient.init();

    // Register commands.
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
    this.discordClient.on('messageCreate', async (message) =>
      console.log('Received message:', message.content)
    );

    this.discordClient.on('messageCreate', async (message) => {
      if (message.content.startsWith('>play') === false) return;

      const YOUTUBE_URL_REGEX =
        />play (https?\:\/\/)?(www\.)?((youtube\.com|youtu\.be)\/.+)$/;
      const regexResult = message.content.match(YOUTUBE_URL_REGEX);

      if (regexResult == null) {
        message.reply('Invalid youtube url, playing Djogani.');
      }

      const voiceChannel = message?.member?.voice.channel;
      if (voiceChannel instanceof VoiceChannel) {
        const connection = await this.connectionManager.connectToChannel(
          voiceChannel
        );

        this.musicPlayer.subscribeToConnection(connection);
        await this.musicPlayer.playYoutubeVideo(
          regexResult
            ? `https://${regexResult[3]}`
            : 'https://youtube.com/watch?v=Zffe_CsJQSA'
        );
      } else {
        message.reply('Need to join a voice channel first.');
      }
    });
  }
}

const app = container.resolve(App);
app.init();
