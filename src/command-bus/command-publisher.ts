import { singleton } from 'tsyringe';
import { Subject } from 'rxjs';
import { Command } from './command';

@singleton()
export class CommandPublisher extends Subject<Command<unknown>> {
  publish(command: Command<unknown>) {
    this.next(command);
  }

  next(command: Command<unknown>) {
    if (!command) {
      throw new Error('The command must be an object');
    }
    if (!command.type) {
      throw new Error('The command must have type');
    }

    super.next(command);
  }
}
