import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { StorageFormMode, StorageFormPage } from './storage-form/storage-form';
import { StorageChildPage } from './storage-child/storage-child';
import { StorageSharedPage } from './storage-shared/storage-shared';
import { StorageRead, StorageWrite } from '../../../models/storage';
import { StorageService } from '../../../services/inventory/storage';
import { PresentationUtil } from '../../../utils/presentation';

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
              private presentationUtil: PresentationUtil) {
    super(storageService, navCtrl, actionSheetCtrl);
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.storageService.storageListListener
      .subscribe((storageList: StorageRead[]) => {
        this.storageList = storageList;
        loading.dismiss();
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
    const storage = StorageWrite.createStorage(payload);
    if (payload.attributes.children && payload.attributes.children.length > 0) {
      this.navCtrl.push(StorageChildPage, {storage});
    } else {
      this.navCtrl.push(StorageFormPage, {
        mode: StorageFormMode.Update,
        storageId: storage.id,
        storage
      })
    }
  }

  onStorageDeleteSuccess = (storage: StorageWrite) => {
    this.presentationUtil.createToast(`Successfully deleted the storage: ${storage.name} (${storage.code})!`);
    this.storageService.findStorages();
  };

  onStorageDeleteError = (storage: StorageWrite) => {
    this.presentationUtil.createToast(`Could not delete the storage: ${storage.name} (${storage.code})!`);
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
