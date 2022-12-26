import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  CommandInteraction,
} from 'discord.js';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import { MusicQueue } from '../music/music-queue';
import { GroovyCommand } from './groovy-command';

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
        type: ApplicationCommandOptionType.Integer,
      },
    ],
  };

  constructor(private readonly musicQueue: MusicQueue) {}

  async handle({ payload }: Command<CommandInteraction>) {
    if (!payload.isChatInputCommand())
      throw new Error('Command should be of type `ChatInputCommand`');

    this.musicQueue.skipToNextSong(this.skipCount(payload));
    await payload.reply('Samo napred');
  }

  private skipCount(command: ChatInputCommandInteraction) {
    return command.options.getInteger('count') ?? 1;
  }
}
