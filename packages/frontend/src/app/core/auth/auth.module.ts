import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components';
import { LoginContainerComponent } from './containers';
import * as fromAuth from './store';
import { AuthEffects } from './store/auth.effects';


@NgModule({
  declarations: [
    LoginComponent,
    LoginContainerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularFireAuthModule,
    AuthRoutingModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducers),
    EffectsModule.forFeature([AuthEffects]),
    SharedModule,
  ],
})
export class AuthModule {
  constructor(
    @Optional() @SkipSelf() existing: AuthModule,
  ) {
    if (existing) {
      throw new Error('AuthModule already imported');
    }
  }
}
