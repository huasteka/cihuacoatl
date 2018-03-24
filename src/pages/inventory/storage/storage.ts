import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { StorageFormMode, StorageFormPage } from './storage-form/storage-form';
import { StorageChildPage } from './storage-child/storage-child';
import { StorageSharedPage } from './storage-shared/storage-shared';
import { StorageRead, StorageWrite } from '../../../models/storage';
import { StorageService } from '../../../services/storage';

@Component({
  selector: 'page-storage',
  templateUrl: 'storage.html'
})
export class StoragePage extends StorageSharedPage implements OnInit, OnDestroy {
  storageList: StorageRead[] = [];
  private subscription: Subscription;

  constructor(storageService: StorageService,
              navCtrl: NavController,
              actionSheetCtrl: ActionSheetController,
              toastCtrl: ToastController) {
    super(storageService, navCtrl, actionSheetCtrl, toastCtrl);
    this.subscription = this.storageService.storageListListener
      .subscribe((storageList: StorageRead[]) => {
        this.storageList = storageList;
      });
  }

  ngOnInit(): void {
    this.storageService.findStorages();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.storageService.findStorages();
  };

  onStorageDeleteError = (storage: StorageWrite) => {
    this.createToast(`Could not delete the storage: ${storage.name} (${storage.code})!`);
  };

  onStorageActionSheet(payload: StorageRead) {
    const storage = StorageWrite.createStorage(payload);
    const buttons = [
      this.createDeleteButton(storage, this.onStorageDeleteSuccess, this.onStorageDeleteError),
      this.createUpdateButton(storage.id, storage),
      this.createAddChildButton(storage.id, storage)
    ];
    this.createActionSheet(buttons).present();
  }
}
