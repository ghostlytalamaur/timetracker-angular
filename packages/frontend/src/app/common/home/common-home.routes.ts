import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@tt/ui/layout';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sessions' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: 'sessions',
            loadChildren: () =>
              import('@tt/sessions/ui').then(
                (mod) => mod.SessionsUiModule,
              ),
          },
          {
            path: 'tags',
            loadChildren: () =>
              import('@tt/tags/ui').then((m) => m.TagsUiModule),
          },
        ],
      },
      {
        path: '',
        outlet: 'sideNav',
        component: SidenavComponent,
      },
      {
        path: '',
        outlet: 'toolbar',
        component: HeaderComponent,
      },
    ],
  },
];
