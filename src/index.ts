import '@abraham/reflection';
import { container, singleton } from 'tsyringe';
import { InteractionHandler } from './interaction-handler';
import { DiscordClient } from './discord-client';
import { GroobyBot } from './grooby-bot';
import { GroovyCommand } from './command-handlers/groovy-command';
import { CommandBus } from './command-bus';

@singleton()
class App {
  constructor(
    private discordClient: DiscordClient,
    private groobyBot: GroobyBot,
    private interactionHandler: InteractionHandler,
    private commandBus: CommandBus
  ) {}

  async init() {
    await this.discordClient.init();
    await this.registerHandlers();
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
