import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StorageFormPage } from './storage-form/storage-form';
import { InventoryService } from '../../../services/inventory';
import { StorageRead } from '../../../models/storage';

@Component({
  selector: 'page-storage',
  templateUrl: 'storage.html'
})
export class StoragePage {
  storageList: StorageRead[] = [];

  constructor(private navCtrl: NavController, private inventoryService: InventoryService) {
  }

  ionViewWillEnter() {
    this.inventoryService.findStorages().subscribe((storageList: StorageRead[]) => {
      console.log(storageList);
      this.storageList = storageList
    });
  }

  onCreateStorage() {
    this.navCtrl.push(StorageFormPage);
  }
}
