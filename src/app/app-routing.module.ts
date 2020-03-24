import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { UiPreviewComponent } from './core/ui-preview/ui-preview.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/sessions' },
  {
    path: 'ui-preview',
    component: UiPreviewComponent,
  },
  { path: 'sessions', loadChildren: () => import('./sessions/sessions.module').then(mod => mod.SessionsModule) },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
