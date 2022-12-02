import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { ToastrModule } from 'ngx-toastr';
import { AUTH_CONFIG, AuthCoreModule, IAuthConfig } from '@tt/auth/core';
import { HttpClientModule } from '@angular/common/http';
import { appInitializerFactory } from './app-initializer.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { ENVIRONMENT } from '@tt/core/services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

function createAuthConfig(): IAuthConfig {
  return {
    domain: environment.auth0.domain,
    clientId: environment.auth0.clientId,
    audience: environment.auth0.audience,
    interceptUrls: [`${environment.serverUrl}/*`],
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,

    AuthCoreModule.forRoot(),
    ToastrModule.forRoot(),
    MatMenuModule,

    OverlayModule,

    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, multi: true },
    { provide: AUTH_CONFIG, useFactory: () => createAuthConfig() },
    { provide: ENVIRONMENT, useValue: environment },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
