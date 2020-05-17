import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth';
import { AppDataContainerComponent } from '@app/core/containers';

import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/sessions' },
  {
    path: '',
    component: AppDataContainerComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'sessions', loadChildren: () => import('./sessions/sessions.module').then(mod => mod.SessionsModule) },
      {
        path: 'tags',
        loadChildren: () => import('./sessions-tags/sessions-tags.module').then(m => m.SessionsTagsModule),
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
