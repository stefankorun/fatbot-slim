import { Client as DiscordClientBase, Intents } from 'discord.js';
import { singleton } from 'tsyringe';
import { ConfigurationService } from './services/configuration';

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
