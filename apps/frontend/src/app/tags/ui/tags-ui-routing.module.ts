import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionsTagsComponent } from './containers';
import { AuthGuard } from '@app/auth/core';

const routes: Routes = [{ path: '', component: SessionsTagsComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsUiRoutingModule {}
