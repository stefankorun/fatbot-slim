import '@abraham/reflection';
import { container, injectable } from 'tsyringe';
import { CommandHandler } from './command-handler';
import { commandHandlerToken } from './tokens';
import { COMMAND_PROCESSOR_METADATA, COMMAND_PROCESSORS_TOKEN } from './constants';

type constructor<T> = {
  new (...args: any[]): T;
};

/**
 * Class decorator factory that registers the class as a command handler within
 * the global dependency container.
 */
export function commandHandler<T extends CommandHandler<any>>(
  commandType: string
): (target: constructor<T>) => void {
  return function (target: constructor<T>): void {
    injectable()(target);
    container.register(commandHandlerToken(commandType), target);
  };
}

export function commandProcessors() {
  return function (target: constructor<unknown>): void {
    injectable()(target);
    container.register(COMMAND_PROCESSORS_TOKEN, target);
  };
}

export function commandProcessor(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const properties: string[] =
      Reflect.getMetadata(COMMAND_PROCESSOR_METADATA, target.constructor) || [];

    Reflect.defineMetadata(
      COMMAND_PROCESSOR_METADATA,
      [...properties, propertyKey],
      target.constructor
    );
  };
}
