import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Credentials } from '../../model';


@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  @Output() signUp: EventEmitter<Credentials> = new EventEmitter<Credentials>();
  @Output() signIn: EventEmitter<Credentials> = new EventEmitter<Credentials>();

  isSignInMode = true;

  onSubmit(form: NgForm) {
    const credentials = {
      email: form.value.email,
      password: form.value.password,
    };
    if (this.isSignInMode) {
      this.signIn.emit(credentials);
    } else {
      this.signUp.emit(credentials);
    }
  }

  onSwitchMode() {
    this.isSignInMode = !this.isSignInMode;
  }
}
