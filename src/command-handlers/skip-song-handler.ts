import { GroovyCommand } from './groovy-command';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { MusicQueue } from '../music-queue';

@commandHandler(GroovyCommand.SkipSong)
export class SkipSongHandler implements CommandHandler<CommandInteraction> {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.SkipSong,
    description: 'Skip to the next song',
    options: [
      {
        required: false,
        description: 'Number of songs to skip',
        name: 'count',
        type: 'INTEGER',
      },
    ],
  };

  constructor(private readonly musicQueue: MusicQueue) {}

  async handle({ payload }: Command<CommandInteraction>) {
    this.musicQueue.playNextSong(this.skipCount(payload));
    await payload.reply('Samo napred');
  }

  private skipCount(command: CommandInteraction) {
    return command.options.getInteger('count') || 1;
  }
}
