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
import { SessionsGroupItemComponent } from './sessions-group-item/sessions-group-item.component';
import { SessionsGroupTypeSelectorComponent } from './sessions-group-type-selector/sessions-group-type-selector.component';
import { SessionsGroupListComponent } from './sessions-group-list/sessions-group-list.component';
import { SessionsContainerComponent } from './sessions-container/sessions-container.component';
import { SettingsEffects } from './store/settings.effects';

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromSessions.sessionsFeatureKey, fromSessions.reducers),
    EffectsModule.forFeature([SessionsEffects, SettingsEffects])
  ],
  declarations: [
    SessionDetailsComponent,
    SessionsListComponent,
    SessionsComponent,
    SessionItemComponent,
    SessionsImportComponent,
    SessionDurationComponent,
    SessionsGroupItemComponent,
    SessionsGroupTypeSelectorComponent,
    SessionsGroupListComponent,
    SessionsContainerComponent
  ]
})
export class SessionsModule {
}
