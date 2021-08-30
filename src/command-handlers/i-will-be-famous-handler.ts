import { Command, commandHandler, CommandHandler } from '../command-bus';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { GroovyCommand } from './groovy-command';

@commandHandler(GroovyCommand.SurpriseMe)
export class IWillBeFamousHandler
  implements CommandHandler<CommandInteraction>
{
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.SurpriseMe,
    description: 'djogani',
  };

  async handle(command: Command<CommandInteraction>) {
    await command.payload.reply('U svim novinama, jeee!');
  }
}
