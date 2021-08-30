import { container, singleton } from 'tsyringe';
import { CommandHandler } from './command-handler';
import { Command } from './command';

/**
 * Simple command bus implementation that uses the dependency container to
 * resolve command handlers.
 */
@singleton()
export class CommandBus {
  execute(command: Command<unknown>) {
    if (!command) throw new Error('Command must be defined!');

    console.log('Handling command: ', command.type);

    const handler: CommandHandler<unknown> = container.resolve(command.type);
    handler.handle(command);
  }
}
