import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';

import { TagsEditorComponent, TagsListComponent } from './components';
import { SessionsTagsComponent } from './containers';
import { SessionsTagsRoutingModule } from './sessions-tags-routing.module';
import { TagsEffects } from './store/effects';
import { fromTags } from './store/reducers';

@NgModule({
  declarations: [SessionsTagsComponent, TagsListComponent, TagsEditorComponent],
  imports: [
    CommonModule,
    SessionsTagsRoutingModule,
    StoreModule.forFeature(fromTags.featureKey, fromTags.reducer),
    EffectsModule.forFeature([TagsEffects]),

    MatListModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    SharedModule,
  ],
})
export class SessionsTagsModule {
}
