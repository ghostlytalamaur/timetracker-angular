import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule, FirebaseOptions } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthModule } from '@app/core/auth';
import { AppStoreModule } from '@app/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import * as fromRoot from './store';

const prodFirebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyDMpoTmKsZfLBR2jDzHTJVnSLhkoMRObwg',
  authDomain: 'timetracker-1548352730517.firebaseapp.com',
  databaseURL: 'https://timetracker-1548352730517.firebaseio.com',
  projectId: 'timetracker-1548352730517',
  storageBucket: '',
  messagingSenderId: '146785403320',
  appId: '1:146785403320:web:69f2e38e38a94bd5',
};

const devFirebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyDgmQKFFQQBlMDKhHHANdDSN4tain-jjao',
  authDomain: 'timetracker-dev-8cae3.firebaseapp.com',
  databaseURL: 'https://timetracker-dev-8cae3.firebaseio.com',
  projectId: 'timetracker-dev-8cae3',
  storageBucket: 'timetracker-dev-8cae3.appspot.com',
  messagingSenderId: '394983106350',
  appId: '1:394983106350:web:35ad55dcaf2c971fd3bcbf',
};

const firebaseOptions: FirebaseOptions = environment.production ? prodFirebaseOptions : devFirebaseOptions;

@NgModule({
  declarations: [
    PageNotFoundComponent,
  ],
  exports: [
    AuthModule,
  ],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseOptions),
    AngularFirestoreModule,
    StoreModule.forRoot(fromRoot.reducers, {
      metaReducers: fromRoot.metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
    }),
    AuthModule,
    AppStoreModule,
  ],
})
export class CoreModule {
}
