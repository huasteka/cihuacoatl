import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StorageWrite } from '../../../../models/storage';
import { StorageFormPage } from '../storage-form/storage-form';

@Component({
  selector: 'page-storage-child',
  templateUrl: './storage-child.html'
})
export class StorageChildPage {
  storage: StorageWrite;

  constructor(private navCtrl: NavController, navParams: NavParams) {
    this.storage = navParams.get('storage');
  }

  onStorageCreate() {
    this.navCtrl.push(StorageFormPage, {storageId: this.storage.id});
  }
}
