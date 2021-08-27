export interface Command<T> {
  type: string;
  payload: T;
}
