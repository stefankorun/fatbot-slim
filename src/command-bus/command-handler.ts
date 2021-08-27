import { Command } from './command';

export interface CommandHandler<T> {
  handle(command: Command<T>): void;
}
