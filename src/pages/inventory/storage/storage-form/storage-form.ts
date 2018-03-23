import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { StorageWrite } from '../../../../models/storage';
import { StorageService } from '../../../../services/storage';

export enum StorageFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'app-storage-form',
  templateUrl: 'storage-form.html'
})
export class StorageFormPage implements OnInit {
  mode: string = StorageFormMode.Create;
  storage: StorageWrite;
  storageForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      console.log(this.navParams.get('storage'));
      this.storage = this.navParams.get('storage');
      console.log(this.storage);
    }
    this.createForm();
  }

  onSubmit() {
    const {code, name} = this.storageForm.value;
    if (this.isUpdate()) {
      this.storageService
        .updateStorage(this.storage.id, code, name)
        .subscribe(() => {
          this.createToast('Storage was successfully updated!');
          this.navCtrl.pop();
        });
    } else {
      this.storageService
        .createStorage(code, name)
        .subscribe(() => {
          this.createToast('Storage was successfully created!');
          this.navCtrl.pop();
        });
    }
  }

  private createForm() {
    let code = '';
    let name = '';
    if (this.isUpdate()) {
      code = this.storage.code;
      name = this.storage.name;
    }
    this.storageForm = new FormGroup({
      code: new FormControl(code, Validators.required),
      name: new FormControl(name, Validators.required)
    });
  }

  private createToast(message: string) {
    const toast = this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  private isUpdate() {
    return this.mode === StorageFormMode.Update;
  }

}
