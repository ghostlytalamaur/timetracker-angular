import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { SessionsPageComponent } from './sessions-page/sessions-page.component';
import { sessionsFeature } from './sessions.store';
import { provideEffects } from '@ngrx/effects';
import { SessionsEffects } from './sessions.effects';

export const ROUTES: Routes = [
  {
    path: '',
    providers: [provideState(sessionsFeature), provideEffects(SessionsEffects)],
    component: SessionsPageComponent,
  },
];
