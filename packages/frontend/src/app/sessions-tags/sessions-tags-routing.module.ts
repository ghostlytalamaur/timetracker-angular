import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/auth.guard';

import { SessionsTagsComponent } from './containers';

const routes: Routes = [{ path: '', component: SessionsTagsComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsTagsRoutingModule {
}
