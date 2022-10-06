import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import { GroobyBot } from '../grooby-bot';
import { GroovyCommand } from './groovy-command';

@commandHandler(GroovyCommand.Play)
export class PlayHandler implements CommandHandler {
  static readonly commandData: ApplicationCommandData = {
    name: GroovyCommand.Play,
    description: 'sviri',
    options: [
      {
        name: 'pesna',
        description: 'Song url or search string',
        type: ApplicationCommandOptionType.String,
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
      !(interaction.member instanceof GuildMember) ||
      !interaction.isChatInputCommand()
    ) {
      throw new Error(
        'Command should be invoked in a Guild, and be of type `ChatInputCommand`'
      );
    }

    await interaction.deferReply();

    const connection = await this.groobyBot.connectToMemberVoiceChannel(
      interaction.member
    );
    if (connection == null) {
      return interaction.reply('Need to join a voice channel first.');
    }

    const songQuery = interaction.options.getString('pesna');
    if (songQuery == null) {
      return interaction.reply('Song query must not be empty.');
    }

    const songs = await this.groobyBot.queueSong(songQuery);
    await interaction.editReply(
      `Added ${songs[0]?.url}` +
        (songs.length > 1
          ? ` and a playlist of ${songs.length - 1} others`
          : '')
    );
  }
}
