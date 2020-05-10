export const enum StatusCode {
  Initial = 'initial',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

interface InitialStatus {
  readonly type: StatusCode.Initial;
}

interface LoadingStatus {
  readonly type: StatusCode.Loading;
}

interface SuccessStatus {
  readonly type: StatusCode.Success;
}

interface ErrorStatus {
  readonly type: StatusCode.Error;
  readonly message: string;
}

export type Status = InitialStatus | LoadingStatus | SuccessStatus | ErrorStatus;

export function initialStatus(): Status {
  return { type: StatusCode.Initial };
}

export function loadingStatus(): Status {
  return { type: StatusCode.Loading };
}

export function successStatus(): Status {
  return { type: StatusCode.Success };
}

export function errorStatus(message: string): Status {
  return {
    type: StatusCode.Error,
    message,
  };
}
