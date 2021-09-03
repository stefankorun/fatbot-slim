import { Command, commandHandler, CommandHandler } from '../command-bus';
import { CommandInteraction } from 'discord.js';
import { GroobyBot } from '../grooby-bot';
import { GroovyCommand } from './groovy-command';

@commandHandler(GroovyCommand.QueueSong)
export class QueueSongHandler implements CommandHandler {
  constructor(private readonly groobyBot: GroobyBot) {}

  async handle(command: Command<CommandInteraction>) {
    const interaction = command.payload;
    const songQuery = interaction.options.getString('pesna');
    if (songQuery == null)
      return interaction.reply('Song query must not be empty.');

    await this.groobyBot.queueSong(songQuery);
    await interaction.reply('Song queued.');
  }
}
