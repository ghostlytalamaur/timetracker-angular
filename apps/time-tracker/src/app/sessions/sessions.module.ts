import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '@app/shared';
import { PushModule } from '@rx-angular/template';
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

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,
    SharedModule,
    MatCheckboxModule,
    MatChipsModule,
    PushModule,
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
export class SessionsModule {}
