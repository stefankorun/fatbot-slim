import { GroovyCommand } from './groovy-command';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import {
  ApplicationCommandData,
  CommandInteraction,
  GuildMember,
  Message,
} from 'discord.js';
import { GroobyBot } from '../grooby-bot';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

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

  constructor(private readonly groobyBot: GroobyBot) {}

  async handle(command: Command<CommandInteraction>) {
    const interaction = command.payload;

    if (interaction?.member == null)
      throw new Error('Music command missing author.');

    if (
      interaction.inGuild() == false ||
      !(interaction.member instanceof GuildMember)
    ) {
      throw new Error('Command should be invoked in a Guild.');
    }

    const connection = await this.groobyBot.connectToMemberVoiceChannel(
      interaction.member
    );
    if (connection == null)
      return interaction.reply('Need to join a voice channel first.');

    const songQuery = interaction.options.getString('pesna');
    if (songQuery == null)
      return interaction.reply('Song query must not be empty.');

    await this.groobyBot.queueSong(songQuery);
  }
}
