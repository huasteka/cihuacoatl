import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

import { AuthService } from 'src/services/auth/auth';

@Component({
  selector: 'app-page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
  ) { }

  public async handleLogin(form: NgForm) {
    const loading = await this.loadingCtrl.create({ message: 'Signing you in...' });
    await loading.present();

    try {
      const { email, password } = form.value;
      await this.authService.signIn(email, password);
    } catch (e: unknown) {
      const toastOptions = { message: 'Incorrect e-mail or password', duration: 4000 };
      const toast = await this.toastCtrl.create({ ...toastOptions, position: 'top' });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }
}
