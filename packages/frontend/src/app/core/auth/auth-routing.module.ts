import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnonymousGuard } from './auth.guard';
import { LoginContainerComponent } from './containers';

const routes: Routes = [
  { path: 'login', component: LoginContainerComponent, canActivate: [AnonymousGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AuthRoutingModule {
}
