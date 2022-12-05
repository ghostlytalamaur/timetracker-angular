import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg[ttIcon]',
  template: `<svg:use [attr.xlink:href]="'assets/icons.svg#' + icon"></svg:use>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon' },
  standalone: true,
})
export class IconComponent {
  @Input('ttIcon')
  icon = '';
}
