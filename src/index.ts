import 'reflect-metadata';
import * as Sentry from '@sentry/node';
import { container, singleton } from 'tsyringe';
import { DiscordClient } from './discord-client';
import { GroobyBot } from './music/grooby-bot';
import { InteractionHandler } from './interaction-handler';
import { ConfigurationService } from './services/configuration';

@singleton()
class App {
  constructor(
    private discordClient: DiscordClient,
    private groobyBot: GroobyBot,
    private interactionHandler: InteractionHandler,
    private configService: ConfigurationService
  ) {}

  async init() {
    await this.registerSentry();
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
    this.discordClient.on('interactionCreate', async (interaction) => {
      try {
        return await this.interactionHandler.handle(interaction);
      } catch (e) {
        Sentry.captureException(e);
        throw e;
      }
    });
  }

  async registerSentry() {
    Sentry.init({
      dsn: this.configService.get('SENTRY_DNS'),
      tracesSampleRate: 1.0,
    });
  }
}

(async () => {
  const app = container.resolve(App);
  await app.init();
})();
