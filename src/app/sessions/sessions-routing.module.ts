import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsComponent } from './containers/sessions/sessions.component';
import { AuthGuard } from '../core/auth/auth.guard';
import { SessionsImportComponent } from './containers/sessions-import/sessions-import.component';
import { SessionsContainerComponent } from './containers/sessions-container/sessions-container.component';
import { SessionDetailsContainerComponent } from './containers/session-details-container/session-details-container.component';

const routes: Routes = [
  {
    path: '', component: SessionsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', component: SessionsContainerComponent },
      { path: 'import', component: SessionsImportComponent },
      { path: ':id', component: SessionDetailsContainerComponent }
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
