import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController,
    private navigationCtrl: NavController,
    private toastCtrl: ToastController,
    private actionSheetService: StorageActionSheetService,
    private storageService: StorageService,
  ) { }

  public async ngOnInit(): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Now Loading...' });
    await loading.present();

    this.subscription$ = this.storageService.listenFindStorageList(
      async (storageList: StorageRead[]) => {
        this.storageList = storageList;
        await loading.dismiss();
      }
    );
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleCreateClick() {
    this.navigationCtrl.navigateForward('/storages/create');
  }

  public handleSelectClick(payload: StorageRead) {
    const storage = StorageWrite.createStorage(payload);
    const targetUrl = `/storages/${storage.id}/details`;
    this.navigationCtrl.navigateForward(targetUrl, { state: storage },);
  }

  public handleUpdateClick(payload: StorageRead) {
    const storage = StorageWrite.createStorage(payload);
    const targetUrl = `/storages/${storage.id}/update`;
    this.navigationCtrl.navigateForward(targetUrl, { state: storage },);
  }

  public async handleActionSheetClick(payload: StorageRead) {
    const storage = StorageWrite.createStorage(payload);

    const buttons = [
      this.actionSheetService.buildDeleteButton(storage, this.handleDeleteSuccess, this.handleDeleteError),
      this.actionSheetService.buildUpdateButton(storage.id, storage),
      this.actionSheetService.buildAddChildButton(storage.id, storage)
    ];

    const actionSheet = await this.actionSheetService.buildActionSheet(buttons);
    await actionSheet.present();
  }

  private handleDeleteSuccess = async (storage: StorageWrite) => {
    const message = `Successfully deleted the storage: ${storage.name} (${storage.code})!`;
    await this.toastCtrl.create({ message, duration: 4000, position: 'top' });
    this.storageService.emitFindStorageList();
  };

  private handleDeleteError = async (storage: StorageWrite) => {
    const message = `Could not delete the storage: ${storage.name} (${storage.code})!`;
    this.toastCtrl.create({ message, duration: 4000, position: 'top' });
  };
}
