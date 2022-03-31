import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { AuthService } from 'src/services/auth/auth';

@Component({
  selector: 'app-page-registration',
  templateUrl: 'registration.page.html',
  styleUrls: ['registration.page.scss'],
})
export class RegistrationPage {
  constructor(
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
  ) { }

  public async handleRegistration(form: NgForm): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Creating your account...' });
    await loading.present();

    try {
      const { name, email, password } = form.value;
      await this.authService.signUp(name, email, password);
    } catch (e: unknown) {
      const toastOptions = { message: 'It was not possible to create your account', duration: 4000 };
      const toast = await this.toastCtrl.create({ ...toastOptions, position: 'top' });
      await toast.present();
    } finally {
      loading.dismiss();
    }
  }

  public handleNavigateBack(): void {
    this.navigationCtrl.back();
  }
}
