import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../services/auth/user';
import { LoadingController, NavParams, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-change-name',
  templateUrl: './change-name.html'
})
export class ChangeNamePage {
  userId: number;

  constructor(private userService: UserService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              navParams: NavParams) {
    this.userId = navParams.data._id;
  }

  onChangeName(form: NgForm) {
    const loading = this.loadingCtrl.create({content: 'Changing your name...'});
    loading.present();

    this.userService.updateUserName(this.userId, form.value.name)
      .subscribe(() => {
          this.createToast('Your name was changed successfully!');
          loading.dismiss();
        },
        () => {
          this.createToast('It was not possible to change your name!');
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
