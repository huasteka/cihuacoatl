import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { StorageWrite } from 'src/models/inventory/storage';
import { StorageService } from 'src/services/inventory/storage';

export enum StorageFormMode {
  create = 'New',
  update = 'Edit',
  append = 'Append',
}

@Component({
  selector: 'app-storage-form',
  templateUrl: 'storage-form.html'
})
export class StorageFormPage implements OnInit {
  public storageForm: FormGroup;

  private formMode: string;
  private storageId?: number;

  constructor(
    private navigationCtrl: NavController,
    private route: ActivatedRoute,
    private location: Location,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storageService: StorageService
  ) { }

  public async ngOnInit() {
    const routeData = await this.route.data.toPromise();
    this.formMode = routeData.formMode;

    const routeParams = await this.route.paramMap.toPromise();
    this.storageId = parseInt(routeParams.get('storageId'), 10);

    const { code = '', name = '' } = this.location.getState() as StorageWrite;
    this.storageForm = new FormGroup({
      code: new FormControl(code, Validators.required),
      name: new FormControl(name, Validators.required)
    });
  }

  public handleSubmit() {
    const { code, name } = this.storageForm.value;
    if (this.isCreate()) {
      this.handleCreate(code, name);
    } else if (this.isUpdate()) {
      this.handleUpdate(code, name);
    } else if (this.isAppend()) {
      this.handleAppend(code, name);
    }
  }

  private async handleCreate(code: string, name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Creating storage...' });
    await loading.present();
    this.storageService
      .createStorage(code, name)
      .subscribe(async () => {
        await loading.dismiss();
        this.handleSubscribe('Storage was successfully created!');
      });
  }

  private async handleUpdate(code: string, name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Updating storage...' });
    await loading.present();
    this.storageService
      .updateStorage(this.storageId, code, name)
      .subscribe(async () => {
        await loading.dismiss();
        this.handleSubscribe('Storage was successfully updated!');
      });
  }

  private async handleAppend(code: string, name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Appending storage...' });
    await loading.present();
    this.storageService
      .createStorageChild(this.storageId, code, name)
      .subscribe(async () => {
        await loading.dismiss();
        this.handleSubscribe(`Storage was successfully appended to ${name}!`);
      });
  }

  private async handleSubscribe(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 4000, position: 'top' });
    await toast.present();

    if (this.storageId) {
      this.storageService.emitFindStorageById(this.storageId);
    } else {
      this.storageService.emitFindStorageList();
    }

    this.navigationCtrl.back();
  }

  private isCreate() {
    return this.formMode === StorageFormMode.create;
  }

  private isUpdate() {
    return this.formMode === StorageFormMode.update;
  }

  private isAppend() {
    return this.formMode === StorageFormMode.append;
  }

}
