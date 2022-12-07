export enum StatusType {
  Initial = 'initial',
  Error = 'error',
  Loading = 'loading',
  Success = 'success',
}

export interface ErrorStatus {
  readonly type: StatusType.Error;
  readonly error: string;
}

interface TypedStatus<T> {
  readonly type: T;
}

export type Status = TypedStatus<Omit<StatusType, StatusType.Error>> | ErrorStatus;

const INITIAL_STATUS: Status = Object.freeze({ type: StatusType.Initial });
const LOADING_STATUS: Status = Object.freeze({ type: StatusType.Loading });
const SUCCESS_STATUS: Status = Object.freeze({ type: StatusType.Success });

export function initialStatus(): Status {
  return INITIAL_STATUS;
}

export function loadStatus(): Status {
  return LOADING_STATUS;
}

export function successStatus(): Status {
  return SUCCESS_STATUS;
}

export function isLoading(status: Status): boolean {
  return status.type === StatusType.Loading;
}
