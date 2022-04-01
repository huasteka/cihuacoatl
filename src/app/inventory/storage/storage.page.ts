import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { StorageRead, StorageWrite } from 'src/models/inventory/storage';
import { StorageService } from 'src/services/inventory/storage';

import { StorageActionSheetService } from './storage-action-sheet.service';

@Component({
  selector: 'app-page-storage',
  templateUrl: 'storage.page.html'
})
export class StoragePage implements OnInit, OnDestroy {
  public storageList: StorageRead[] = [];

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private toastCtrl: ToastController,
    private actionSheetService: StorageActionSheetService,
    private storageService: StorageService,
  ) { }

  public async ngOnInit(): Promise<void> {
    this.subscription$ = this.storageService.listenFindStorageList(
      async (storageList: StorageRead[]) => this.storageList = storageList
    );

    this.storageService.emitFindStorageList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleSelectClick(payload: StorageRead) {
    const storage = StorageWrite.createStorage(payload);
    const targetUrl = `/home/modules/inventory/storages/${storage.id}/details`;
    this.navigationCtrl.navigateForward(targetUrl, { state: storage },);
  }

  public async handleActionSheetClick(payload: StorageRead) {
    const storage = StorageWrite.createStorage(payload);

    const buttons = [
      this.actionSheetService.buildDeleteButton(storage, this.handleDeleteSuccess, this.handleDeleteError),
      this.actionSheetService.buildUpdateButton(storage.id),
      this.actionSheetService.buildAddChildButton(storage.id),
    ];

    const actionSheet = await this.actionSheetService.buildActionSheet(buttons);
    await actionSheet.present();
  }

  private handleDeleteSuccess = async (storage: StorageWrite) => {
    const message = `Successfully deleted the storage: ${storage.name} (${storage.code})!`;
    await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    this.storageService.emitFindStorageList();
  };

  private handleDeleteError = async (storage: StorageWrite) => {
    const message = `Could not delete the storage: ${storage.name} (${storage.code})!`;
    this.toastCtrl.create({ message, duration: 3000, position: 'top' });
  };
}
