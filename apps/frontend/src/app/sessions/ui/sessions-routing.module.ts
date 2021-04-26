import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  SessionDetailsContainerComponent,
  SessionsComponent,
  SessionsContainerComponent,
  SessionsImportComponent,
} from './containers';
import { AuthGuard } from '@app/auth/core';

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
