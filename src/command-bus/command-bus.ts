import { container, singleton } from 'tsyringe';
import { CommandHandler } from './command-handler';
import { Command } from './command';

/**
 * Simple command bus implementation that uses the dependency container to
 * resolve command handlers.
 */
@singleton()
export class CommandBus {
  execute(command: Command<any>) {
    if (!command) throw new Error('Command must be defined!');

    console.log('Handling command: ', command.type);

    const handler: CommandHandler<any> = container.resolve(command.type);
    handler.handle(command);
  }
}
