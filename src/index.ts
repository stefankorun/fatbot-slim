import '@abraham/reflection';
import { container, singleton } from 'tsyringe';
import { InteractionHandler } from './interaction-handler';
import { DiscordClient } from './discord-client';
import { GroobyBot } from './grooby-bot';

@singleton()
class App {
  constructor(
    private discordClient: DiscordClient,
    private groobyBot: GroobyBot,
    private interactionHandler: InteractionHandler
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
      if (message?.member == null)
        throw new Error('Music command missing author.');

      const connection = await this.groobyBot.connectToMemberVoiceChannel(
        message.member
      );
      if (connection == null)
        return message.reply('Need to join a voice channel first.'), undefined;

      const songQuery = message.content.replace('>play ', '');

      this.groobyBot.queueSong(songQuery);
    });
  }

  async registerHandlers() {
    // Register bot commands.
    const mainGuild = await this.groobyBot.getMainGuild();
    if (mainGuild) {
      await this.interactionHandler.register(mainGuild);
    } else {
      console.error('Could not find Guild to attach commands to.');
    }

    // Register command and message handlers.
    this.discordClient.on(
      'interactionCreate',
      async (interaction) => await this.interactionHandler.handle(interaction)
    );

    // Replay message on receive.
    this.discordClient.on('messageCreate', async (message) =>
      console.log('Received message:', message.content)
    );
  }
}

const app = container.resolve(App);
app.init();
