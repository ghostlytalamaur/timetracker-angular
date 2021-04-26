import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@app/ui/layout';
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
            loadChildren: () => import('@app/sessions/ui').then((mod) => mod.SessionsUiModule),
          },
          {
            path: 'tags',
            loadChildren: () => import('@app/tags/ui').then((m) => m.TagsUiModule),
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
