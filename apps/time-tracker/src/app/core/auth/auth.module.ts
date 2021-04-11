import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import {
  AuthConfig,
  AuthConfigService,
  AuthHttpInterceptor,
  AuthModule as Auth0Module,
} from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginContainerComponent } from './containers';

function createAuthConfig(): AuthConfig {
  return {
    domain: environment.auth0.domain,
    clientId: environment.auth0.clientId,
    audience: environment.auth0.audience,
    httpInterceptor: {
      allowedList: [`${environment.serverUrl}/*`],
    },
  };
}

@NgModule({
  declarations: [LoginContainerComponent],
  imports: [CommonModule, FormsModule, Auth0Module.forRoot(), AuthRoutingModule, SharedModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: AuthConfigService, useFactory: () => createAuthConfig() },
  ],
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() existing: AuthModule) {
    if (existing) {
      throw new Error('AuthModule already imported');
    }
  }
}
