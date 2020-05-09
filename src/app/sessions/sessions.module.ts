import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  GroupTableRowComponent,
  SessionDetailsComponent,
  SessionDurationComponent,
  SessionsGroupTypeSelectorComponent,
  SessionsTableComponent,
  SessionsTableRowComponent,
} from './components';
import {
  SessionDetailsContainerComponent,
  SessionsComponent,
  SessionsContainerComponent,
  SessionsImportComponent,
} from './containers';
import { SessionsRoutingModule } from './sessions-routing.module';
import { effects } from './store/effects';
import * as fromFeature from './store/reducers';

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromFeature.featureKey, fromFeature.reducer),
    EffectsModule.forFeature(effects),
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
