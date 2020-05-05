import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';

import {
  GroupTableRowComponent,
  SessionDetailsComponent,
  SessionDurationComponent,
  SessionsGroupTypeSelectorComponent,
  SessionsTableComponent,
  SessionsTableRowComponent,
} from './components';
import { SessionDetailsContainerComponent, SessionsComponent, SessionsContainerComponent, SessionsImportComponent, } from './containers';
import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsEffects, SessionsTableEffects, SettingsEffects, fromSessionsFeature } from './store';


@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromSessionsFeature.sessionsFeatureKey, fromSessionsFeature.reducers),
    EffectsModule.forFeature([SessionsEffects, SettingsEffects, SessionsTableEffects]),
  ],
  declarations: [
    SessionDetailsComponent,
    SessionDetailsContainerComponent,
    SessionsComponent,
    SessionsImportComponent,
    SessionDurationComponent,
    SessionsGroupTypeSelectorComponent,
    SessionsContainerComponent,
    SessionsTableComponent,
    SessionsTableRowComponent,
    GroupTableRowComponent,
  ],
})
export class SessionsModule {
}
