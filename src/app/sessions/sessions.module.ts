import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { SessionsListComponent } from './sessions-list/sessions-list.component';
import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './sessions/sessions.component';
import { StoreModule } from '@ngrx/store';
import * as fromSessions from './store';
import { SharedModule } from '../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { SessionsEffects } from './store/sessions.effects';

@NgModule({
  declarations: [SessionDetailsComponent, SessionsListComponent, SessionsComponent],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    StoreModule.forFeature(fromSessions.sessionsFeatureKey, fromSessions.reducers),
    EffectsModule.forFeature([SessionsEffects]),
    SharedModule
  ]
})
export class SessionsModule {
}
