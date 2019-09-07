import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsListComponent } from './sessions-list/sessions-list.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { SessionsComponent } from './sessions/sessions.component';
import { AuthGuard } from '../core/auth/auth.guard';

const routes: Routes = [
  {
    path: '', component: SessionsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', component: SessionsListComponent },
      { path: ':id', component: SessionDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SessionsRoutingModule {
}
