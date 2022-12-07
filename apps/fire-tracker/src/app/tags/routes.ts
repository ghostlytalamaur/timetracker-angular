import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TagsEffects } from '../state/tags.effects';
import { tagsFeature } from '../state/tags.store';
import { TagsPageComponent } from './tags-page/tags-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: TagsPageComponent,
    providers: [provideState(tagsFeature), provideEffects(TagsEffects)],
  },
];
