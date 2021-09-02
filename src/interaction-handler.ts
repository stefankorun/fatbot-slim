import { Guild, Interaction } from 'discord.js';
import { injectable } from 'tsyringe';
import { CommandBus } from './command-bus';
import commands from './command-handlers';
import { ConfigurationService } from './services/configuration';

@injectable()
export class InteractionHandler {
  constructor(
    private readonly commandBus: CommandBus,
    private config: ConfigurationService
  ) {}

  async register(guild: Guild) {
    return guild.commands.set(
      commands.map((command) => ({
        ...command,
        name: this.config.get('DISCORD_PREFIX')
          ? `${this.config.get('DISCORD_PREFIX')}_${command.name}`
          : command.name,
      }))
    );
  }

  async handle(interaction: Interaction) {
    if (!interaction.isCommand() || !interaction.guildId) return;

    this.commandBus.execute({
      type: interaction.commandName.replace(
        `${this.config.get('DISCORD_PREFIX')}_`,
        ''
      ),
      payload: interaction,
    });
  }
}
