import { Component } from '@angular/core';
import { ActionSheetController, NavController } from 'ionic-angular';

import { StorageFormMode, StorageFormPage } from './storage-form/storage-form';
import { StorageService } from '../../../services/storage';
import { StorageRead, StorageWrite } from '../../../models/storage';
import { StorageChildPage } from './storage-child/storage-child';

@Component({
  selector: 'page-storage',
  templateUrl: 'storage.html'
})
export class StoragePage {
  storageList: StorageRead[] = [];

  constructor(private storageService: StorageService,
              private actionSheetCtrl: ActionSheetController,
              private navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.storageService.findStorages().subscribe((storageList: StorageRead[]) => {
      this.storageList = storageList
    });
  }

  onStorageCreate() {
    this.navCtrl.push(StorageFormPage, {mode: StorageFormMode.Create});
  }

  onStorageSelect(storage: StorageRead) {
    if (storage.attributes.children && storage.attributes.children.length > 0) {
      this.navCtrl.push(StorageChildPage, {storage: storage.attributes});
    }
  }

  onStorageActionSheet(payload: StorageRead) {
    const deleteButton = {
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.storageService.deleteStorage(payload.id).subscribe();
      }
    };

    const updateButton = {
      text: 'Update',
      icon: 'create',
      handler: () => {
        const storage = StorageWrite.createStorage(payload);
        this.navCtrl.push(StorageFormPage, {mode: StorageFormMode.Update, storage});
      }
    };

    const cancelButton = {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    };

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Storage Operations',
      buttons: [deleteButton, updateButton, cancelButton]
    });
    actionSheet.present();
  }
}
