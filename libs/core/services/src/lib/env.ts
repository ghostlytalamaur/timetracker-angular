import { InjectionToken } from '@angular/core';

export interface IEnvironment {
  readonly serverUrl: string;
  readonly settings: {
    readonly dateFormat: 'EEEE, MMMM d, y',
    readonly timeFormat: 'HH:mm:ss',
    readonly durationFormat: 'hh:mm:ss',
    readonly durationRate: 1000,
  },
}

export const ENVIRONMENT = new InjectionToken<IEnvironment>('Application Environment');
