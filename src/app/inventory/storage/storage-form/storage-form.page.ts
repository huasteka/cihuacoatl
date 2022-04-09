import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { StorageRead } from 'src/models/inventory/storage';
import { StorageService } from 'src/services/inventory/storage';

export enum StorageFormMode {
  create = 'New',
  update = 'Edit',
  append = 'Append',
}

@Component({
  selector: 'app-storage-form',
  templateUrl: 'storage-form.page.html',
  styleUrls: ['storage-form.page.scss'],
})
export class StorageFormPage implements OnInit {
  public formMode: string;
  public storageForm: FormGroup;

  private storageId?: number;

  constructor(
    private route: ActivatedRoute,
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storageService: StorageService
  ) { }

  public async ngOnInit() {
    this.formMode = this.route.snapshot.data.formMode;

    if (!this.isCreate()) {
      this.storageId = parseInt(this.route.snapshot.params?.storageId, 10);
    }

    if (this.isUpdate()) {
      await this.loadStorageForm();
      return;
    }

    this.storageForm = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required)
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

  private async loadStorageForm(): Promise<void> {
    this.storageService.findStorageById(this.storageId).subscribe(async (storage: StorageRead) => {
      const { code, name } = storage.attributes;
      this.storageForm = new FormGroup({
        code: new FormControl(code, Validators.required),
        name: new FormControl(name, Validators.required)
      });
    });
  }

  private async handleCreate(code: string, name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Creating storage...' });
    await loading.present();
    this.storageService
      .createStorage(code, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('Storage was successfully created!');
        },
        async () => await this.presentToast('It was not possible to create the storage!')
      );
  }

  private async handleUpdate(code: string, name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Updating storage...' });
    await loading.present();
    this.storageService
      .updateStorage(this.storageId, code, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('Storage was successfully updated!');
        },
        async () => await this.presentToast('It was not possible to update the storage!')
      );
  }

  private async handleAppend(code: string, name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Appending storage...' });
    await loading.present();
    this.storageService
      .createStorageChild(this.storageId, code, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe(`Storage was successfully appended to ${name}!`);
        },
        async () => await this.presentToast('It was not possible to append the storage!')
      );
  }

  private async handleSubscribe(message: string) {
    await this.presentToast(message);
    this.storageService.emitFindStorageList();
    this.navigationCtrl.navigateBack('/home/modules/inventory/storages');
  }

  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top', keyboardClose: true });
    await toast.present();
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
