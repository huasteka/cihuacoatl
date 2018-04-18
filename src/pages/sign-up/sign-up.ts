import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController, ToastController } from 'ionic-angular';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
  }

  onSignUp(form: NgForm) {
    const loading = this.loadingCtrl.create({content: 'Creating your account...'});
    loading.present();
    const {name, email, password} = form.value;
    this.authService.signUp(name, email, password)
      .subscribe(
        () => loading.dismiss(),
        () => {
          this.createToast('It was not possible to create your account');
          loading.dismiss();
        });
  }

  onNavigateBack() {
    this.navCtrl.pop();
  }

  private createToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
}
