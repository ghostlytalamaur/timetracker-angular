import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SessionDetailsComponent,
  SessionDurationComponent,
  SessionItemComponent,
  SessionsGroupItemComponent,
  SessionsGroupListComponent,
  SessionsGroupTypeSelectorComponent,
} from './components';
import { SessionsRoutingModule } from './sessions-routing.module';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import {
  SessionDetailsContainerComponent,
  SessionsComponent,
  SessionsContainerComponent,
  SessionsImportComponent,
  SessionsListComponent,
} from './containers';
import { SessionsEffects, SettingsEffects } from './store/effects';
import { fromSessionsFeature } from './store';

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
