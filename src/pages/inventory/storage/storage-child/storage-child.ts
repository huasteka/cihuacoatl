import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { StorageFormMode, StorageFormPage } from '../storage-form/storage-form';
import { StorageSharedPage } from '../storage-shared/storage-shared';
import { StorageRead, StorageWrite } from '../../../../models/storage';
import { StorageService } from '../../../../services/inventory/storage';
import { PresentationUtil } from '../../../../utils/presentation';

@Component({
  selector: 'page-storage-child',
  templateUrl: './storage-child.html'
})
export class StorageChildPage extends StorageSharedPage implements OnInit, OnDestroy {
  storage: StorageWrite;
  private subscription: Subscription;

  constructor(storageService: StorageService,
              navCtrl: NavController,
              navParams: NavParams,
              actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    super(storageService, navCtrl, actionSheetCtrl);
    this.storage = navParams.get('storage');
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.storageService.storageListener.subscribe((storage: StorageRead) => {
      this.storage = StorageWrite.createStorage(storage);
      loading.dismiss();
    });
  }

  ngOnInit(): void {
    this.storageService.findStorageById(this.storage.id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onStorageCreate() {
    this.navCtrl.push(StorageFormPage, {
      mode: StorageFormMode.AddChild,
      storage: this.storage,
      storageId: this.storage.id
    });
  }

  onStorageDeleteSuccess = (storage: StorageWrite) => {
    this.presentationUtil.createToast(`Successfully deleted the storage: ${storage.name} (${storage.code})!`);
    this.storageService.findStorageById(this.storage.id);
  };

  onStorageDeleteError = (storage: StorageWrite) => {
    this.presentationUtil.createToast(`Could not delete the storage: ${storage.name} (${storage.code})!`);
  };

  onStorageActionSheet(storage: StorageWrite) {
    const buttons = [
      this.createDeleteButton(storage, this.onStorageDeleteSuccess, this.onStorageDeleteError),
      this.createUpdateButton(this.storage.id, storage)
    ];
    this.createActionSheet(buttons).present();
  }

  onNavigateToUpdate(storage: StorageWrite) {
    this.navCtrl.push(StorageFormPage, {
      mode: StorageFormMode.Update,
      storage: storage,
      storageId: storage.id
    });
  }
}
