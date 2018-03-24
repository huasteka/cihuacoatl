import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, NavController, NavParams, ToastController } from 'ionic-angular';
import { StorageRead, StorageWrite } from '../../../../models/storage';
import { StorageFormMode, StorageFormPage } from '../storage-form/storage-form';
import { StorageService } from '../../../../services/storage';
import { StorageSharedPage } from '../storage-shared/storage-shared';
import { Subscription } from 'rxjs/Subscription';

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
              toastCtrl: ToastController) {
    super(storageService, navCtrl, actionSheetCtrl, toastCtrl);
    this.storage = navParams.get('storage');
    this.subscription = this.storageService.storageListener.subscribe((storage: StorageRead) => {
      console.log(storage);
      this.storage = StorageWrite.createStorage(storage);
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
    this.createToast(`Successfully deleted the storage: ${storage.name} (${storage.code})!`);
    this.storageService.findStorageById(this.storage.id);
  };

  onStorageDeleteError = (storage: StorageWrite) => {
    this.createToast(`Could not delete the storage: ${storage.name} (${storage.code})!`);
  };

  onStorageActionSheet(storage: StorageWrite) {
    const buttons = [
      this.createDeleteButton(storage, this.onStorageDeleteSuccess, this.onStorageDeleteError),
      this.createUpdateButton(this.storage.id, storage)
    ];
    this.createActionSheet(buttons).present();
  }
}
