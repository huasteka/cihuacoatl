import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { UserService } from 'src/services/auth/user';

@Component({
  selector: 'app-page-change-name',
  templateUrl: 'change-name.page.html',
  styleUrls: ['change-name.page.scss']
})
export class ChangeNamePage implements OnInit {
  public changeNameForm: FormGroup;

  constructor(
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: UserService,
  ) { }

  public async ngOnInit(): Promise<void> {
    const { id = null, name = '' } = await this.userService.findUserProfile();

    this.changeNameForm = new FormGroup({
      userId: new FormControl(id, Validators.nullValidator),
      name: new FormControl(name, Validators.required),
    });
  }

  public async handleSubmit() {
    const loading = await this.loadingCtrl.create({ message: 'Changing your name...' });
    await loading.present();

    const { userId, name } = this.changeNameForm.value;
    this.userService.updateUserName(userId, name)
      .subscribe(
        async () => {
          await this.presentToast('Your name was changed successfully!');
          await loading.dismiss();
          this.navigationCtrl.navigateBack('/home/modules/dashboard');
        },
        async () => {
          await this.presentToast('It was not possible to change your name!');
          await loading.dismiss();
        });
  }

  private async presentToast(message: string) {
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
