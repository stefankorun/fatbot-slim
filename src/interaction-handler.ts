import { Guild, Interaction } from 'discord.js';
import { injectable } from 'tsyringe';
import { CommandBus } from './command-bus';
import commands from './command-handlers';

@injectable()
export class InteractionHandler {

  constructor(private readonly commandBus: CommandBus) {
  }

  async register(guild: Guild) {
    return guild.commands.set(commands);
  }

  async handle(interaction: Interaction) {
    if (!interaction.isCommand() || !interaction.guildId) return;

    this.commandBus.execute({
      type: interaction.commandName,
      payload: interaction
    });
  }
}
