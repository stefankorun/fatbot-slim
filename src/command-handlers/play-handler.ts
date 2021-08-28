import { GroovyCommand } from './groovy-command';
import { Command, commandHandler, CommandHandler } from '../command-bus';
import { Message } from 'discord.js';
import { GroobyBot } from '../grooby-bot';

@commandHandler(GroovyCommand.Play)
export class PlayHandler implements CommandHandler<Message> {

  constructor(private readonly groobyBot: GroobyBot) {
  }

  async handle({ payload: message }: Command<Message>) {
    if (message?.member == null)
      throw new Error('Music command missing author.');

    const connection = await this.groobyBot.connectToMemberVoiceChannel(
      message.member
    );
    if (connection == null)
      return message.reply('Need to join a voice channel first.');

    const songQuery = message.content.replace('>play ', '');

    this.groobyBot.queueSong(songQuery);
  }
}
