import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { StorageWrite } from '../../../../models/storage';
import { StorageService } from '../../../../services/storage';

export enum StorageFormMode {
  Create = 'New',
  Update = 'Edit',
  AddChild = 'Append'
}

@Component({
  selector: 'app-storage-form',
  templateUrl: 'storage-form.html'
})
export class StorageFormPage implements OnInit {
  mode: string = StorageFormMode.Create;
  storage: StorageWrite;
  storageId: number;
  storageForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate() || this.isAddChild()) {
      this.storage = this.navParams.get('storage');
      this.storageId = this.navParams.get('storageId');
    }
    this.createForm();
  }

  onSubmit() {
    const {code, name} = this.storageForm.value;
    if (this.isCreate()) {
      this.onStorageCreate(code, name);
    } else if (this.isUpdate()) {
      this.onStorageUpdate(code, name);
    } else if (this.isAddChild()) {
      this.onStorageAddChild(code, name);
    }
  }

  private onStorageCreate(code: string, name: string) {
    this.storageService
      .createStorage(code, name)
      .subscribe(() => {
        this.createToast('Storage was successfully created!');
        this.storageService.findStorages();
        this.navCtrl.pop();
      });
  }

  private onStorageUpdate(code: string, name: string) {
    this.storageService
      .updateStorage(this.storage.id, code, name)
      .subscribe(() => {
        this.createToast('Storage was successfully updated!');
        this.onStorageReload();
        this.navCtrl.pop();
      });
  }

  private onStorageAddChild(code: string, name: string) {
    this.storageService
      .createStorageChild(this.storage.id, code, name)
      .subscribe(() => {
        this.createToast(`Storage was successfully added to ${this.storage.name}!`);
        this.onStorageReload();
        this.navCtrl.pop();
      });
  }

  private onStorageReload() {
    if (this.storageId) {
      this.storageService.findStorageById(this.storageId);
    } else {
      this.storageService.findStorages();
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

  private isCreate() {
    return this.mode === StorageFormMode.Create;
  }

  private isUpdate() {
    return this.mode === StorageFormMode.Update;
  }

  private isAddChild() {
    return this.mode === StorageFormMode.AddChild;
  }

}
