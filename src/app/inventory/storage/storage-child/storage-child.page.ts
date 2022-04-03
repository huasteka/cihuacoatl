import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { StorageRead, StorageWrite } from 'src/models/inventory/storage';
import { StorageService } from 'src/services/inventory/storage';

import { StorageActionSheetService } from '../storage-action-sheet.service';

@Component({
  selector: 'app-page-storage-child',
  templateUrl: './storage-child.page.html'
})
export class StorageChildPage implements OnInit, OnDestroy {
  public storage: StorageWrite;

  private subscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navigationCtrl: NavController,
    private toastCtrl: ToastController,
    private actionSheetService: StorageActionSheetService,
    private storageService: StorageService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.storageService.listenFindStorageById(
      async (storage: StorageRead) => this.storage = StorageWrite.createStorage(storage)
    );

    const storageId = parseInt(this.route.snapshot.params.storageId, 10);
    this.storageService.emitFindStorageById(storageId);
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleAppendClick() {
    const targetUrl = `/home/modules/inventory/storages/append/${this.storage.id}`;
    this.navigationCtrl.navigateForward(targetUrl);
  }

  public handleUpdateClick(selectedStorage: StorageWrite) {
    const targetUrl = `/home/modules/inventory/storages/update/${selectedStorage.id}`;
    this.navigationCtrl.navigateForward(targetUrl);
  }

  public async handleActionSheetClick(storage: StorageWrite) {
    const buttons = [
      this.actionSheetService.buildDeleteButton(storage, this.handleDeleteSuccess, this.handleDeleteError),
      this.actionSheetService.buildUpdateButton(storage.id),
    ];

    const actionSheet = await this.actionSheetService.buildActionSheet(buttons);
    await actionSheet.present();
  }

  private handleDeleteSuccess = async (storage: StorageWrite) => {
    const message = `Successfully deleted the storage: ${storage.name} (${storage.code})!`;
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();

    this.storageService.emitFindStorageList();
    this.navigationCtrl.navigateBack(`/home/modules/inventory/storages`);
  };

  private handleDeleteError = async (storage: StorageWrite) => {
    const message = `Could not delete the storage: ${storage.name} (${storage.code})!`;
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };
}
