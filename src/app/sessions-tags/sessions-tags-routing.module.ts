import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionsTagsComponent } from './containers';

const routes: Routes = [{ path: '', component: SessionsTagsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsTagsRoutingModule { }
