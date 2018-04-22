import { Injectable } from '@angular/core';
import { Loading, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class PresentationUtil {
  constructor(private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
  }

  createLoading(content: string): Loading {
    return this.loadingCtrl.create({content});
  }

  createToast(message: string, duration: number = 2000) {
    this.toastCtrl
      .create({message, duration})
      .present();
  }
}
