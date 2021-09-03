import { GroovyCommand } from './groovy-command';
import {
  Command,
  commandHandler,
  CommandHandler,
} from '../command-bus';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';

// TODO remove
@commandHandler(GroovyCommand.Play)
export class PlayHandler implements CommandHandler {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.Play,
    description: 'sviri',
    options: [
      {
        name: 'pesna',
        description: 'Song url or search string',
        type: 'STRING',
        required: true,
      },
    ],
  };

  async handle(command: Command<CommandInteraction>) {
    console.log('Handling play command...');
  }
}
