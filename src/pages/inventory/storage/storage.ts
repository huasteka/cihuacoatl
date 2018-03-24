import { Component } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from 'ionic-angular';

import { StorageFormMode, StorageFormPage } from './storage-form/storage-form';
import { StorageService } from '../../../services/storage';
import { StorageRead, StorageWrite } from '../../../models/storage';
import { StorageChildPage } from './storage-child/storage-child';
import { StorageSharedPage } from './storage-shared/storage-shared';

@Component({
  selector: 'page-storage',
  templateUrl: 'storage.html'
})
export class StoragePage extends StorageSharedPage {
  storageList: StorageRead[] = [];

  constructor(storageService: StorageService,
              navCtrl: NavController,
              actionSheetCtrl: ActionSheetController,
              toastCtrl: ToastController) {
    super(storageService, navCtrl, actionSheetCtrl, toastCtrl);
  }

  ionViewWillEnter() {
    this.onStorageLoad();
  }

  onStorageLoad() {
    this.storageService.findStorages().subscribe((storageList: StorageRead[]) => {
      this.storageList = storageList
    });
  }

  onStorageCreate() {
    this.navCtrl.push(StorageFormPage, {mode: StorageFormMode.Create});
  }

  onStorageSelect(payload: StorageRead) {
    if (payload.attributes.children && payload.attributes.children.length > 0) {
      const storage = StorageWrite.createStorage(payload);
      this.navCtrl.push(StorageChildPage, {storage});
    }
  }

  onStorageDeleteSuccess = (storage: StorageWrite) => {
    this.createToast(`Successfully deleted the storage: ${storage.name} (${storage.code})!`);
    this.onStorageLoad();
  };

  onStorageDeleteError = (storage: StorageWrite) => {
    this.createToast(`Could not delete the storage: ${storage.name} (${storage.code})!`);
  };

  onStorageActionSheet(payload: StorageRead) {
    const storage = StorageWrite.createStorage(payload);
    const buttons = [
      this.createDeleteButton(storage, this.onStorageDeleteSuccess, this.onStorageDeleteError),
      this.createUpdateButton(storage),
      this.createAddChildButton(storage)
    ];
    this.createActionSheet(buttons).present();
  }
}
