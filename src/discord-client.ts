import { Client as DiscordClientBase, GatewayIntentBits } from 'discord.js';
import { singleton } from 'tsyringe';
import { ConfigurationService } from './services/configuration';

@singleton()
export class DiscordClient extends DiscordClientBase {
  constructor(private configService: ConfigurationService) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildIntegrations,
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
