import { container, singleton } from 'tsyringe';
import { Command } from './command';
import { CommandHandler } from './command-handler';

/**
 * Simple command bus implementation that uses the dependency container to
 * resolve command handlers.
 */
@singleton()
export class CommandBus {
  async execute(command: Command<unknown>) {
    if (!command) throw new Error('Command must be defined!');

    console.log('Handling command: ', command.type);

    const handler: CommandHandler<unknown> = container.resolve(command.type);
    await handler.handle(command);
  }
}
