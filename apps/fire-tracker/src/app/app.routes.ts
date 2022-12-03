import { Route } from '@angular/router';
import { isSignedIn } from './auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'sessions',
    canActivate: [isSignedIn],
    loadChildren: () => import('./sessions/routes').then((m) => m.ROUTES),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'profile',
    canActivate: [isSignedIn],
    loadComponent: () => import('./auth/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: '',
    redirectTo: 'sessions',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'sessions',
  },
];
