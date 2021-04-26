import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@tt/auth/core';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('@tt/common/home').then((mod) => mod.CommonHomeModule),
  },
  {
    path: '**',
    loadChildren: () => import('@tt/errors/page-not-found').then((m) => m.ErrorsPageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
