import { inject, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    provideFirebaseApp(() => initializeApp(inject(APP_CONFIG).firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
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
