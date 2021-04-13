import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { TagsEditorComponent, TagsListComponent } from './components';
import { SessionsTagsComponent } from './containers';
import { TagsUiRoutingModule } from './tags-ui-routing.module';
import { UiStatusModule } from '@tt/ui/status';
import { UiMenuModule } from '@tt/ui/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SessionsTagsComponent, TagsListComponent, TagsEditorComponent],
  imports: [
    CommonModule,
    TagsUiRoutingModule,
    UiStatusModule,
    UiMenuModule,

    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class TagsUiModule {}
