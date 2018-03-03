import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ToastController } from 'ionic-angular';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignInPage {
  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {}

  onSignIn(form: NgForm) {
    const loading = this.loadingCtrl.create({content: 'Signing you in...'});
    loading.present();
    const {email, password} = form.value;
    this.authService.signIn(email, password)
      .subscribe(
        () => loading.dismiss(),
        () => {
          this.createToast('Incorrect e-mail or password');
          loading.dismiss();
        });
  }

  private createToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
}
