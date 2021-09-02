import { GroovyCommand } from './groovy-command';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { MusicPlayer } from '../music-player';

@commandHandler(GroovyCommand.Pause)
export class PauseHandler implements CommandHandler {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.Pause,
    description: 'Pauses the player'
  };

  constructor(private readonly musicPlayer: MusicPlayer) {
  }

  async handle(command: Command<CommandInteraction>) {
    await this.musicPlayer.pause();
    await command.payload.reply('Paused');
  }
}
