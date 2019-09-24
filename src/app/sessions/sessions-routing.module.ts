import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { SessionsComponent } from './sessions/sessions.component';
import { AuthGuard } from '../core/auth/auth.guard';
import { SessionsImportComponent } from './import/sessions-import.component';
import { SessionsContainerComponent } from './sessions-container/sessions-container.component';

const routes: Routes = [
  {
    path: '', component: SessionsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', component: SessionsContainerComponent },
      { path: 'import', component: SessionsImportComponent },
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
