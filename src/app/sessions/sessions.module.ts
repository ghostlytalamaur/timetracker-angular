import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';

import {
  SessionDetailsComponent,
  SessionDurationComponent,
  SessionItemComponent,
  SessionsGroupItemComponent,
  SessionsGroupListComponent,
  SessionsGroupTypeSelectorComponent,
} from './components';
import {
  SessionDetailsContainerComponent,
  SessionsComponent,
  SessionsContainerComponent,
  SessionsImportComponent,
  SessionsListComponent,
} from './containers';
import { SessionsRoutingModule } from './sessions-routing.module';
import { fromSessionsFeature } from './store';
import { SessionsEffects, SettingsEffects } from './store/effects';

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromSessionsFeature.sessionsFeatureKey, fromSessionsFeature.reducers),
    EffectsModule.forFeature([SessionsEffects, SettingsEffects]),
  ],
  declarations: [
    SessionDetailsComponent,
    SessionDetailsContainerComponent,
    SessionsListComponent,
    SessionsComponent,
    SessionItemComponent,
    SessionsImportComponent,
    SessionDurationComponent,
    SessionsGroupItemComponent,
    SessionsGroupTypeSelectorComponent,
    SessionsGroupListComponent,
    SessionsContainerComponent,
  ],
})
export class SessionsModule {
}
