import { container, injectable } from 'tsyringe';
import { CommandHandler } from './command-handler';

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
    container.register(commandType, target);
  };
}
