import { Component } from '@angular/core';
import { UserService } from '../../../services/auth/user';
import { LoadingController, NavParams, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { User } from '../../../models/user';

@Component({
  selector: 'page-change-password',
  templateUrl: './change-password.html'
})
export class ChangePasswordPage {
  user: User;

  constructor(private userService: UserService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              navParams: NavParams) {
    const {_id, name, email} = navParams.data;
    this.user = User.createUser(_id, name, email);
  }

  onChangePassword(form: NgForm) {
    const loading = this.loadingCtrl.create({content: 'Changing your password...'});
    loading.present();

    const {password, passwordConfirmation} = form.value;
    this.userService.updatePassword(this.user.id, password, passwordConfirmation)
      .subscribe(() => {
          this.createToast('Your password was changed successfully!');
          loading.dismiss();
        },
        () => {
          this.createToast('It was not possible to change the password!');
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
