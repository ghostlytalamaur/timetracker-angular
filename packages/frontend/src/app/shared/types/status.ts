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

export function loadingStatus(status: Status): Status {
  return { ...status, type: StatusCode.Loading };
}

export function successStatus(status: Status): Status {
  return { ...status, type: StatusCode.Success };
}

export function errorStatus(status: Status, message: string): Status {
  return {
    type: StatusCode.Error,
    message,
  };
}

export function getStatusError(status: Status): string | null {
  return status.type === StatusCode.Error ? status.message : null;
}

export function isInitialStatus(status: Status): boolean {
  return status.type === StatusCode.Initial;
}

export function isResolvedStatus(status: Status): boolean {
  return status.type === StatusCode.Success;
}

export function isLoadingStatus(status: Status): boolean {
  return status.type === StatusCode.Loading;
}

export function isErrorStatus(status: Status): boolean {
  return status.type === StatusCode.Error;
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  return JSON.stringify(err);
}
