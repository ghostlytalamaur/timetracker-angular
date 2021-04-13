import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tt-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {}
