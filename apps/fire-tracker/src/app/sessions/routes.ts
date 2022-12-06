import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { SessionsPageComponent } from './sessions-page/sessions-page.component';
import { sessionsFeature } from './sessions.store';
import { provideEffects } from '@ngrx/effects';
import { SessionsEffects } from './sessions.effects';
import { sessionsViewFeature } from './sessions-view.store';

export const ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(sessionsFeature),
      provideState(sessionsViewFeature),
      provideEffects(SessionsEffects),
    ],
    component: SessionsPageComponent,
  },
];
