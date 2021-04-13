import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
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
import { UiStatusModule } from '@tt/ui/status';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UiMenuModule } from '@tt/ui/menu';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { UiDateTimeModule } from '@tt/ui/date-time';
import { MatSelectModule } from '@angular/material/select';
import { UiDialogsModule } from '@tt/ui/dialogs';

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,
    MatCheckboxModule,
    MatChipsModule,
    PushModule,
    UiStatusModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    UiMenuModule,
    MatTreeModule,
    MatIconModule,
    UiDateTimeModule,
    MatSelectModule,
    UiDialogsModule,
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
export class SessionsUiModule {}
