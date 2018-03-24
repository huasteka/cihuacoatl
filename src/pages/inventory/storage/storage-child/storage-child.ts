import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams, ToastController } from 'ionic-angular';
import { StorageRead, StorageWrite } from '../../../../models/storage';
import { StorageFormMode, StorageFormPage } from '../storage-form/storage-form';
import { StorageService } from '../../../../services/storage';
import { StorageSharedPage } from '../storage-shared/storage-shared';

@Component({
  selector: 'page-storage-child',
  templateUrl: './storage-child.html'
})
export class StorageChildPage extends StorageSharedPage {
  storage: StorageWrite;

  constructor(storageService: StorageService,
              navCtrl: NavController,
              navParams: NavParams,
              actionSheetCtrl: ActionSheetController,
              toastCtrl: ToastController) {
    super(storageService, navCtrl, actionSheetCtrl, toastCtrl);
    this.storage = navParams.get('storage');
  }

  ionViewWillEnter() {
    this.onStorageLoad();
  }

  onStorageLoad() {
    this.storageService.findStorageById(this.storage.id).subscribe((storage: StorageRead) => {
      this.storage = StorageWrite.createStorage(storage);
    });
  }

  onStorageCreate() {
    this.navCtrl.push(StorageFormPage, {
      mode: StorageFormMode.AddChild,
      storage: this.storage
    });
  }

  onStorageDeleteSuccess = (storage: StorageWrite) => {
    this.createToast(`Successfully deleted the storage: ${storage.name} (${storage.code})!`);
    this.onStorageLoad();
  };

  onStorageDeleteError = (storage: StorageWrite) => {
    this.createToast(`Could not delete the storage: ${storage.name} (${storage.code})!`);
  };

  onStorageActionSheet(storage: StorageWrite) {
    const buttons = [
      this.createDeleteButton(storage, this.onStorageDeleteSuccess, this.onStorageDeleteError),
      this.createUpdateButton(storage)
    ];
    this.createActionSheet(buttons).present();
  }
}
