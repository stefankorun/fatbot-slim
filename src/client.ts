import { Client as DiscordClientBase, Intents } from 'discord.js';
import { singleton } from 'tsyringe';
import { ConfigurationService } from './configuration';

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
    await this.login(this.configService.get('token'));

    this.on('ready', () => {
      console.log(`Logged in as ${this?.user?.tag}!`);
    });
  }
}

@singleton()
export class GroobyClient {
  constructor(private discordClient: DiscordClient) {}

  /**
   * Flaky logic for getting the main "Guild" on the server.
   * @returns The first Guild found on the server.
   */
  async getMainGuild() {
    return this.discordClient.guilds.cache.first();
  }
}
