import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './common-home.routes';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { LetModule } from '@rx-angular/template';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatButtonModule,
    LetModule,
    MatIconModule,
  ],
  declarations: [HeaderComponent, SidenavComponent],
})
export class CommonHomeModule {}
