import { ApplicationCommandData, Guild, Interaction } from 'discord.js';
import { injectable } from 'tsyringe';

@injectable()
export class InteractionHandler {
  async register(guild: Guild) {
    return guild.commands.set([
      {
        name: 'bicu-poznata',
        description: 'Djogani',
      },
    ]);
  }

  async handle(interaction: Interaction) {
    if (!interaction.isCommand() || !interaction.guildId) return;

    if (interaction.commandName === 'bicu-poznata') {
      await interaction.reply('U svim novinama, jeee!');
    }
  }
}
