import { inject, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app.component';
import { APP_CONFIG } from './app.config';
import { appRoutes } from './app.routes';
import { AuthEffects } from './auth/auth.effects';
import { authFeature } from './auth/auth.store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { provideSilentSignIn } from './auth/silent-sign.service';
import { preferencesFeature } from './preferences/preferences.store';
import { PreferencesEffects } from './preferences/preferences.effects';
import { connectFirestoreEmulator } from '@firebase/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    provideFirebaseApp(() => initializeApp(inject(APP_CONFIG).firebase)),
    provideAuth(() => {
      const auth = getAuth();
      const config = inject(APP_CONFIG);
      if (config.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      const config = inject(APP_CONFIG);
      if (config.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 9098);
      }
      return firestore;
    }),
  ],
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideStore(
      {
        [authFeature.name]: authFeature.reducer,
        [preferencesFeature.name]: preferencesFeature.reducer,
      },
      {},
    ),
    provideStoreDevtools({
      maxAge: 100,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideRouterStore(),
    provideEffects(AuthEffects, PreferencesEffects),
    provideSilentSignIn(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
