import { Injectable } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from '@ionic/angular';

import { StorageWrite } from 'src/models/inventory/storage';
import { StorageService } from 'src/services/inventory/storage';

@Injectable()
export class StorageActionSheetService {
  constructor(
    protected navigationCtrl: NavController,
    protected actionSheetCtrl: ActionSheetController,
    protected storageService: StorageService,
  ) { }

  public buildDeleteButton(
    storage: StorageWrite,
    successCallback: (storage: StorageWrite) => void,
    errorCallback: (storage: StorageWrite) => void
  ): ActionSheetButton {
    const observable = this.storageService.deleteStorage(storage.id);
    const handler = () => observable.toPromise()
      .then(() => successCallback(storage))
      .catch(() => errorCallback(storage));

    return {
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler,
    };
  }

  public buildUpdateButton(storageId: number, storage: StorageWrite): ActionSheetButton {
    return {
      text: 'Update',
      icon: 'create',
      handler: () => this.navigationCtrl.navigateForward(
        `/storages/${storageId}/update`,
        { state: storage },
      ),
    };
  }

  public buildAddChildButton(storageId: number, storage: StorageWrite): ActionSheetButton {
    return {
      text: 'Append',
      icon: 'add',
      handler: () => this.navigationCtrl.navigateForward(
        `/storages/${storageId}/append`,
        { state: storage },
      ),
    };
  }

  public buildActionSheet(buttons: ActionSheetButton[]) {
    buttons.push({ text: 'Cancel', icon: 'close', role: 'cancel' });
    return this.actionSheetCtrl.create({ header: 'Storage Operations', buttons });
  }
}
