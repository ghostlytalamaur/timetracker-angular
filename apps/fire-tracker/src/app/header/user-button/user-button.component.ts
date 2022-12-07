import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions, authFeature } from '../../auth/auth.store';
import { PushModule } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { IconComponent } from '../../ui/icon.component';

@Component({
  selector: 'tt-user-button',
  templateUrl: './user-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PushModule, NgIf, CdkMenuTrigger, CdkMenu, CdkMenuItem, IconComponent],
})
export class UserButtonComponent {
  private readonly store = inject(Store);
  protected readonly user$ = this.store.select(authFeature.selectUser);

  protected onSignOut(): void {
    this.store.dispatch(authActions.signOut());
  }
}
