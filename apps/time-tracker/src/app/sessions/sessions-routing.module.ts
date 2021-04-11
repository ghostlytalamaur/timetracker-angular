import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth/auth.guard';

import {
  SessionDetailsContainerComponent,
  SessionsComponent,
  SessionsContainerComponent,
  SessionsImportComponent,
} from './containers';

const routes: Routes = [
  {
    path: '',
    component: SessionsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', component: SessionsContainerComponent },
      { path: 'import', component: SessionsImportComponent },
      { path: ':id', component: SessionDetailsContainerComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsRoutingModule {}
