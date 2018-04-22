import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { StorageWrite } from '../../../../models/storage';
import { StorageService } from '../../../../services/inventory/storage';
import { PresentationUtil } from '../../../../utils/presentation';

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
              private presentationUtil: PresentationUtil,
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
    const loading = this.presentationUtil.createLoading('Creating storage...');
    loading.present();
    this.storageService
      .createStorage(code, name)
      .subscribe(() => this.onFinishStorageOperation('Storage was successfully created!', loading));
  }

  private onStorageUpdate(code: string, name: string) {
    const loading = this.presentationUtil.createLoading('Updating storage...');
    loading.present();
    this.storageService
      .updateStorage(this.storage.id, code, name)
      .subscribe(() => this.onFinishStorageOperation('Storage was successfully updated!', loading));
  }

  private onStorageAddChild(code: string, name: string) {
    const loading = this.presentationUtil.createLoading('Appending storage...');
    loading.present();
    this.storageService
      .createStorageChild(this.storage.id, code, name)
      .subscribe(() => {
        const toastMessage = `Storage was successfully appended to ${this.storage.name}!`;
        this.onFinishStorageOperation(toastMessage, loading);
      });
  }

  private onFinishStorageOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.onStorageReload();
    this.navCtrl.pop();
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
