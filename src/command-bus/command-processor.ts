import { Observable } from 'rxjs';
import { Command } from './command';

export type CommandProcessor = (
  commands$: Observable<Command<unknown>>
) => Observable<Command<unknown>>;
