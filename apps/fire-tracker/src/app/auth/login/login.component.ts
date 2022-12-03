import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { authActions } from '../auth.store';

@Component({
  selector: 'tt-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent {
  private readonly store = inject(Store);

  protected email = '';
  protected password = '';

  protected async onLogin() {
    if (!this.email || !this.password) {
      return;
    }

    this.store.dispatch(authActions.signIn({ email: this.email, password: this.password }));
  }
}
