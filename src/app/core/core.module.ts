import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { StoreModule } from '@ngrx/store';
import * as fromRoot from './store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthModule } from './auth/auth.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  exports: [
    AuthModule
  ],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDMpoTmKsZfLBR2jDzHTJVnSLhkoMRObwg',
      authDomain: 'timetracker-1548352730517.firebaseapp.com',
      databaseURL: 'https://timetracker-1548352730517.firebaseio.com',
      projectId: 'timetracker-1548352730517',
      storageBucket: '',
      messagingSenderId: '146785403320',
      appId: '1:146785403320:web:69f2e38e38a94bd5'
    }),
    AngularFirestoreModule,
    StoreModule.forRoot(fromRoot.reducers, {
      metaReducers: fromRoot.metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: false,
        strictActionSerializability: false
      }
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production
    }),
    AuthModule
  ]
})
export class CoreModule {
}
