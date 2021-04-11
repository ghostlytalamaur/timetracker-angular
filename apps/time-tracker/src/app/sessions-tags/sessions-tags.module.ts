import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '@app/shared';

import { TagsEditorComponent, TagsListComponent } from './components';
import { SessionsTagsComponent } from './containers';
import { SessionsTagsRoutingModule } from './sessions-tags-routing.module';

@NgModule({
  declarations: [SessionsTagsComponent, TagsListComponent, TagsEditorComponent],
  imports: [
    CommonModule,
    SessionsTagsRoutingModule,

    MatListModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    SharedModule,
  ],
})
export class SessionsTagsModule {}
