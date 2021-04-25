import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionsTagsComponent } from './containers';
import { AuthGuard } from '@tt/auth/core';

const routes: Routes = [{ path: '', component: SessionsTagsComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsUiRoutingModule {}
