import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { authActions, authFeature } from '../auth.store';
import { PushModule } from '@ngrx/component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'tt-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, PushModule, NgIf],
})
export class LoginComponent {
  private readonly store = inject(Store);
  protected readonly error$ = this.store.select(authFeature.selectError);

  protected email = '';
  protected password = '';

  protected async onLogin() {
    if (!this.email || !this.password) {
      return;
    }

    this.store.dispatch(authActions.signIn({ email: this.email, password: this.password }));
  }
}
