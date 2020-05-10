import { ChangeDetectionStrategy, Component } from '@angular/core';

import { routerAnimation } from '../../animations';

@Component({
  selector: 'app-router-container',
  templateUrl: './router-container.component.html',
  styleUrls: ['./router-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerAnimation],
})
export class RouterContainerComponent {


  public logAnimation(event: any): void {
    console.log(event);
  }

}
