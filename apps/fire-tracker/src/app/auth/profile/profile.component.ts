import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PushModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { authActions, authFeature } from '../auth.store';

@Component({
  selector: 'tt-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, PushModule, MatIconModule],
})
export class ProfileComponent {
  private readonly store = inject(Store);
  protected readonly user$ = this.store.select(authFeature.selectUser);

  protected onLogout() {
    this.store.dispatch(authActions.signOut());
  }
}
