export interface Status {
  readonly resolved: boolean;
  readonly pending: boolean;
}

export function initialStatus(): Status {
  return {
    resolved: false,
    pending: false,
  };
}

export function loadStatus(status: Status): Status {
  return {
    ...status,
    pending: true,
  };
}

export function successStatus(status: Status): Status {
  return {
    ...status,
    pending: false,
    resolved: true,
  };
}
