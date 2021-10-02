import { Command, commandHandler, CommandHandler } from '../command-bus';
import { MusicQueue } from '../music-queue';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { GroovyCommand } from './groovy-command';

@commandHandler(GroovyCommand.ShowQueue)
export class ShowQueueHandler implements CommandHandler<CommandInteraction> {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.ShowQueue,
    description: 'Showing queued songs',
  };

  constructor(private musicQueue: MusicQueue) {}

  async handle(command: Command<CommandInteraction>) {
    const queue = [this.musicQueue.nowPlaying, ...this.musicQueue.queue];

    await command.payload.reply(
      `Sviram: ${queue.map((song, index) => `\n ${index + 1}. ${song?.url}`)}`
    );
  }
}
