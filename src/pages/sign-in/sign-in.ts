import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SignUpPage } from '../sign-up/sign-up';
import { AuthService } from '../../services/auth/auth';
import { PresentationUtil } from '../../utils/presentation';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignInPage {
  registerPage = SignUpPage;

  constructor(private authService: AuthService,
              private presentationUtil: PresentationUtil) {
  }

  onSignIn(form: NgForm) {
    const loading = this.presentationUtil.createLoading('Signing you in...');
    loading.present();
    const {email, password} = form.value;
    this.authService.signIn(email, password)
      .subscribe(
        () => loading.dismiss(),
        () => {
          this.presentationUtil.createToast('Incorrect e-mail or password');
          loading.dismiss();
        });
  }
}
