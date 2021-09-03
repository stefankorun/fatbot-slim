import { Command, commandHandler, CommandHandler } from '../command-bus';
import { CommandInteraction, Message } from 'discord.js';
import { GroobyBot } from '../grooby-bot';
import { GroovyCommand } from './groovy-command';

@commandHandler(GroovyCommand.QueueVmroAnthem)
export class QueueVmroAnthemHandler implements CommandHandler {
  private static readonly DUDANS_ID = '319951263892766720';
  private static readonly VMRO_ANTHEM =
    'https://www.youtube.com/watch?v=TLiYL6pNMro';
  private static readonly THE_LEADER_EMOJI = 'vojvoda';

  constructor(private readonly groobyBot: GroobyBot) {}

  async handle(command: Command<CommandInteraction>) {
    const interaction = command.payload;

    await this.groobyBot.queueSong(QueueVmroAnthemHandler.VMRO_ANTHEM);
    await interaction.reply('Kakva pesta?');
    const message = await interaction.fetchReply();
    const nikolasEmoji = this.findNikolasEmoji(interaction);

    if (nikolasEmoji && message instanceof Message)
      await message.react(nikolasEmoji);
  }

  private findNikolasEmoji(interaction: CommandInteraction) {
    return interaction.guild?.emojis.cache.find(
      (emoji) => emoji.name === QueueVmroAnthemHandler.THE_LEADER_EMOJI
    );
  }
}
