import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { SessionsPageComponent } from './sessions-page/sessions-page.component';
import { sessionsFeature } from './sessions.store';
import { provideEffects } from '@ngrx/effects';
import { SessionsEffects } from './sessions.effects';
import { sessionsViewFeature } from './sessions-view.store';
import { tagsFeature } from '../state/tags.store';
import { TagsEffects } from '../state/tags.effects';

export const ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(sessionsFeature),
      provideState(tagsFeature),
      provideState(sessionsViewFeature),
      provideEffects(SessionsEffects),
      provideEffects(TagsEffects),
    ],
    component: SessionsPageComponent,
  },
];
