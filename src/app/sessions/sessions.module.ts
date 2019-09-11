import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { SessionsListComponent } from './sessions-list/sessions-list.component';
import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './sessions/sessions.component';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { SessionsEffects } from './store/sessions.effects';
import { SessionItemComponent } from './sessions-list/session-item/session-item.component';
import { SessionsImportComponent } from './import/sessions-import.component';
import * as fromSessions from './store';
import { SessionDurationComponent } from './session-duration/session-duration.component';

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromSessions.sessionsFeatureKey, fromSessions.reducers),
    EffectsModule.forFeature([SessionsEffects])
  ],
  declarations: [
    SessionDetailsComponent,
    SessionsListComponent,
    SessionsComponent,
    SessionItemComponent,
    SessionsImportComponent,
    SessionDurationComponent
  ]
})
export class SessionsModule {
}
