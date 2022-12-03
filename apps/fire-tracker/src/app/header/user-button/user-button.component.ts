import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../../auth/auth.store';
import { PushModule } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'tt-user-button',
  templateUrl: './user-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PushModule, NgIf, CdkMenuTrigger],
})
export class UserButtonComponent {
  private readonly store = inject(Store);
  protected readonly user$ = this.store.select(authFeature.selectUser);
}
