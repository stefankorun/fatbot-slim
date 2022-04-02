import { GroovyCommand } from './groovy-command';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { MusicPlayer } from '../music-player';

@commandHandler(GroovyCommand.Resume)
export class ResumeHandler implements CommandHandler {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.Resume,
    description: 'Resumes the player',
  };

  constructor(private readonly musicPlayer: MusicPlayer) {}

  async handle(command: Command<CommandInteraction>) {
    await this.musicPlayer.resume();
    await command.payload.reply('Resumed');
  }
}
