import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TopBarComponent } from '../../header/top-bar/top-bar.component';

@Component({
  selector: 'tt-top-bar-layout',
  templateUrl: './top-bar-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TopBarComponent],
})
export class TopBarLayoutComponent {}
