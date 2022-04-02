import { GroovyCommand } from './groovy-command';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { MusicQueue } from '../music-queue';

@commandHandler(GroovyCommand.Stop)
export class StopHandler implements CommandHandler<CommandInteraction> {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.Stop,
    description: 'Stops the music',
  };

  constructor(private readonly musicQueue: MusicQueue) {}

  async handle(command: Command<CommandInteraction>) {
    this.musicQueue.clear();
    await command.payload.reply('Golema da e');
  }
}
