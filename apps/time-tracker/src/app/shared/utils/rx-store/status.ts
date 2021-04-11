import { HttpErrorResponse } from '@angular/common/http';
import { patch, patchObject, StateOperator } from '../operators';

interface IErrorState {
  readonly message: string;
}

export interface IStatus {
  readonly requested: number;
  readonly resolved: boolean;
  readonly pending: boolean;
  readonly error: IErrorState | null;
}

export function initialStatus(): IStatus {
  return {
    requested: 0,
    resolved: false,
    pending: false,
    error: null,
  };
}

export function loadingStatus(status: IStatus): IStatus {
  return patchObject(status, { pending: true });
}

export function successStatus(): StateOperator<IStatus>;
export function successStatus(status: IStatus): IStatus;
export function successStatus(status?: IStatus): IStatus | StateOperator<IStatus> {
  const op = patch<IStatus>({
    error: null,
    pending: false,
    resolved: true,
  });

  return status ? op(status) : op;
}

export function errorStatus(message: string): StateOperator<IStatus>;
export function errorStatus(status: IStatus, message: string): IStatus;
export function errorStatus(
  statusOrMsg: IStatus | string,
  message?: string,
): IStatus | StateOperator<IStatus> {
  const op = patch<IStatus>({
    error: {
      message: message ?? (typeof statusOrMsg === 'string' ? statusOrMsg : ''),
    },
  });

  return typeof statusOrMsg === 'string' ? op : op(statusOrMsg);
}

export function requestedStatus(status: IStatus, requested: boolean): IStatus {
  return patchObject(status, {
    requested: requested ? status.requested + 1 : status.requested - 1,
  });
}

export function getStatusError(status: IStatus): string | null {
  return status.error?.message ?? null;
}

export function isResolvedStatus(status: IStatus): boolean {
  return status.resolved;
}

export function isLoadingStatus(status: IStatus): boolean {
  return status.pending;
}

export function isErrorStatus(status: IStatus): boolean {
  return !!status.error;
}

export function isRequestedStatus(status: IStatus): boolean {
  return status.requested > 0;
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    return err.message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return JSON.stringify(err);
}
