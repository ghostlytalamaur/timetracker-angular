import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { StoreModule } from '@ngrx/store';

import { TagsListComponent } from './components';
import { SessionsTagsComponent } from './containers';
import { SessionsTagsRoutingModule } from './sessions-tags-routing.module';
import { fromTags } from './store/reducers';

@NgModule({
  declarations: [SessionsTagsComponent, TagsListComponent],
  imports: [
    CommonModule,
    SessionsTagsRoutingModule,
    StoreModule.forFeature(fromTags.featureKey, fromTags.reducer),

    MatListModule,
  ],
})
export class SessionsTagsModule {
}
