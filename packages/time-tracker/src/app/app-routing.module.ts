import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@tt/auth/core';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('libs/common/home/src/lib/common-home.module').then((mod) => mod.CommonHomeModule),
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
