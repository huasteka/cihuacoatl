import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';

import { StorageFormMode, StorageFormPage } from '../storage-form/storage-form';
import { StorageWrite } from '../../../../models/storage';
import { StorageService } from '../../../../services/inventory/storage';

export class StorageSharedPage {
  constructor(protected storageService: StorageService,
              protected navCtrl: NavController,
              protected actionSheetCtrl: ActionSheetController) {
  }

  createDeleteButton(storage: StorageWrite,
                     successCallback: (storage: StorageWrite) => void,
                     errorCallback: (storage: StorageWrite) => void): ActionSheetButton {
    return {
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.storageService.deleteStorage(storage.id)
          .subscribe(() => successCallback(storage), () => errorCallback(storage));
      }
    };
  }

  createUpdateButton(storageId: number, storage: StorageWrite): ActionSheetButton {
    return {
      text: 'Update',
      icon: 'create',
      handler: () => {
        this.navCtrl.push(StorageFormPage, {
          mode: StorageFormMode.Update,
          storageId,
          storage
        });
      }
    };
  }

  createAddChildButton(storageId: number, storage: StorageWrite): ActionSheetButton {
    return {
      text: 'Append',
      icon: 'add',
      handler: () => {
        this.navCtrl.push(StorageFormPage, {
          mode: StorageFormMode.AddChild,
          storageId,
          storage
        });
      }
    };
  }

  createActionSheet(buttons: ActionSheetButton[]) {
    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });
    return this.actionSheetCtrl.create({
      title: 'Storage Operations',
      buttons: buttons
    });
  }
}
