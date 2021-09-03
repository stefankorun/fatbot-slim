import { Observable } from 'rxjs';
import { container, singleton } from 'tsyringe';
import { commandHandlerToken } from './tokens';
import { Command } from './command';
import { CommandHandler } from './command-handler';
import { CommandProcessor } from './command-processor';
import {
  COMMAND_PROCESSOR_METADATA,
  COMMAND_PROCESSORS_TOKEN,
} from './constants';
import { CommandPublisher } from './command-publisher';
import { flatten } from '../utils';

@singleton()
export class CommandBus extends Observable<Command<unknown>> {
  constructor(private readonly commandPublisher: CommandPublisher) {
    super();

    this.source = this.commandPublisher;
    this.registerProcessors();
  }

  execute(command: Command<unknown>) {
    // Publish the command
    this.commandPublisher.publish(command);

    // Execute the command
    this.handlerFor(command)?.handle(command);
  }

  private handlerFor(command: Command<unknown>) {
    try {
      return container.resolve<CommandHandler<unknown>>(
        commandHandlerToken(command.type)
      );
    } catch (e) {
      return null;
    }
  }

  private registerProcessors() {
    const processors: CommandProcessor[] = container
      .resolveAll<any>(COMMAND_PROCESSORS_TOKEN)
      .map((instance) => this.processorsFrom(instance))
      .reduce(flatten, []);

    processors.forEach((processor) => this.registerProcessor(processor));
  }

  private processorsFrom(instance: any) {
    return this.processorNamesFrom(instance).map((processorName: string) =>
      instance[processorName].bind(instance)
    );
  }

  private processorNamesFrom(instance: any): string[] {
    return (
      Reflect.getMetadata(COMMAND_PROCESSOR_METADATA, instance.constructor) ||
      []
    );
  }

  private registerProcessor(processor: CommandProcessor) {
    const commandStream$ = processor(this);

    // TODO keep tack of the subscriptions
    commandStream$.subscribe((command: Command<unknown>) =>
      this.execute(command)
    );
  }
}
