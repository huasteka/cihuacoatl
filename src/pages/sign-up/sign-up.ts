import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth/auth';
import { PresentationUtil } from '../../utils/presentation';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private presentationUtil: PresentationUtil) {
  }

  onSignUp(form: NgForm) {
    const loading = this.presentationUtil.createLoading('Creating your account...');
    loading.present();
    const {name, email, password} = form.value;
    this.authService.signUp(name, email, password)
      .subscribe(
        () => loading.dismiss(),
        () => {
          this.presentationUtil.createToast('It was not possible to create your account');
          loading.dismiss();
        });
  }

  onNavigateBack() {
    this.navCtrl.pop();
  }
}
