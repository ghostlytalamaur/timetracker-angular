import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { UserButtonComponent } from '../user-button/user-button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tt-top-bar',
  templateUrl: './top-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: { class: 'flex items-center justify-between' },
  imports: [ThemeSwitcherComponent, UserButtonComponent, RouterLink],
})
export class TopBarComponent {}
