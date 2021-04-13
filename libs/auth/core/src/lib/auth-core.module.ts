import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  AuthConfig,
  AuthConfigService,
  AuthHttpInterceptor,
  AuthModule as Auth0Module,
} from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

function createAuthConfig(env: IAuthConfig): AuthConfig {
  return {
    domain: env.domain,
    clientId: env.clientId,
    audience: env.audience,
    httpInterceptor: {
      allowedList: env.interceptUrls,
    },
  };
}

export const AUTH_CONFIG = new InjectionToken<IAuthConfig>('Auth Config');

export interface IAuthConfig {
  readonly domain: string;
  readonly clientId: string;
  readonly audience: string;
  readonly interceptUrls: string[];
}

@NgModule({
  imports: [Auth0Module.forRoot(), CommonModule, MatProgressSpinnerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: AuthConfigService, useFactory: () => createAuthConfig(inject(AUTH_CONFIG)) },
  ],
})
export class AuthCoreModule {
  public static forRoot(): ModuleWithProviders<AuthCoreModule> {
    return {
      ngModule: AuthCoreModule,
      providers: [],
    };
  }

  constructor(@Optional() @SkipSelf() existing: AuthCoreModule) {
    if (existing) {
      throw new Error('AuthModule already imported');
    }
  }
}
