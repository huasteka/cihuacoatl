import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { UserService } from 'src/services/auth/user';

@Component({
  selector: 'app-page-change-password',
  templateUrl: 'change-password.page.html',
  styleUrls: ['change-password.page.scss']
})
export class ChangePasswordPage implements OnInit {
  private userId: number;

  constructor(
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: UserService,
  ) { }

  public async ngOnInit(): Promise<void> {
    const { id } = await this.userService.findUserProfile();
    this.userId = id;
  }

  public async handleSubmit(form: NgForm) {
    const loading = await this.loadingCtrl.create({ message: 'Changing your password...' });
    await loading.present();

    const { password, passwordConfirmation } = form.value;
    this.userService.updatePassword(this.userId, password, passwordConfirmation)
      .subscribe(
        async () => {
          await this.presentToast('Your password was changed successfully!');
          await loading.dismiss();
          this.navigationCtrl.navigateBack('/home/modules/dashboard');
        },
        async () => {
          await this.presentToast('It was not possible to change the password!');
          await loading.dismiss();
        },
      );
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      animated: true,
      keyboardClose: true
    });
    await toast.present();
  }
}
