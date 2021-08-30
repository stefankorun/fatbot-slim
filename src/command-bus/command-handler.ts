import { CommandInteraction } from 'discord.js';
import { Command } from './command';

export interface CommandHandler<T = CommandInteraction> {
  handle(command: Command<T>): void;
}
