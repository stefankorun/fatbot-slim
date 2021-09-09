import { Command, commandHandler, CommandHandler } from '../command-bus';
import { GroobyBot } from '../grooby-bot';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { GroovyCommand } from './groovy-command';

@commandHandler(GroovyCommand.KolkuVistiniIma)
export class TruthCountHandler implements CommandHandler<CommandInteraction> {
  constructor(private readonly groobyBot: GroobyBot) {}

  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.KolkuVistiniIma,
    description: 'biser-balkanski',
  };

  async handle(command: Command<CommandInteraction>) {
    const interaction = command.payload;
    const songQuery = 'Biser Balkanski';

    await this.groobyBot.queueSong(songQuery);
    await interaction.reply('Ima samo edna vistina!');
  }
}
