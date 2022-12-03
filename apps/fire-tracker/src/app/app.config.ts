import { InjectionToken } from '@angular/core';
import { FirebaseOptions } from '@angular/fire/app';

export interface AppConfig {
  readonly firebase: FirebaseOptions;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => {
    const config: AppConfig = {
      firebase: {
        apiKey: 'AIzaSyAR62G2hpBY3QxKHihkSX0RvL2T9LVOavs',
        authDomain: 'fire-tracker-b48f3.firebaseapp.com',
        projectId: 'fire-tracker-b48f3',
        storageBucket: 'fire-tracker-b48f3.appspot.com',
        messagingSenderId: '623495248954',
        appId: '1:623495248954:web:9f07eff73b89c10a444903',
      },
    };

    return config;
  },
});
