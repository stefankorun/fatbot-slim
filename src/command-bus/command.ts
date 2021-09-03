export interface Command<T> {
  readonly type: string;
  payload: T;
}
