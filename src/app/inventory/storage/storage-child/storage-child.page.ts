import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { StorageRead, StorageWrite } from 'src/models/inventory/storage';
import { StorageService } from 'src/services/inventory/storage';

import { StorageActionSheetService } from '../storage-action-sheet.service';

@Component({
  selector: 'app-page-storage-child',
  templateUrl: './storage-child.html'
})
export class StorageChildPage implements OnInit, OnDestroy {
  public storage: StorageWrite;

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private route: ActivatedRoute,
    private location: Location,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetService: StorageActionSheetService,
    private storageService: StorageService,
  ) { }

  public async ngOnInit(): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Now Loading...' });
    await loading.present();

    this.subscription$ = this.storageService.listenFindStorageById(async (storage: StorageRead) => {
      await loading.dismiss();
      this.storage = StorageWrite.createStorage(storage);
    });

    this.storage = this.location.getState() as StorageWrite;
    if (this.storage) {
      await loading.dismiss();
    } else {
      const routeParams = await this.route.paramMap.toPromise();
      const storageId = parseInt(routeParams.get('storageId'), 10);
      this.storageService.emitFindStorageById(storageId);
    }
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleAppendClick() {
    this.navigationCtrl.navigateForward(`/storages/${this.storage.id}/append`, { state: this.storage });
  }

  public handleUpdateClick(storage: StorageWrite) {
    this.navigationCtrl.navigateForward(`/storages/${this.storage.id}/update`, { state: storage });
  }

  public async handleActionSheetClick(storage: StorageWrite) {
    const buttons = [
      this.actionSheetService.buildDeleteButton(storage, this.handleDeleteSuccess, this.handleDeleteError),
      this.actionSheetService.buildUpdateButton(this.storage.id, storage)
    ];

    const actionSheet = await this.actionSheetService.buildActionSheet(buttons);
    await actionSheet.present();
  }

  private handleDeleteSuccess = async (storage: StorageWrite) => {
    const message = `Successfully deleted the storage: ${storage.name} (${storage.code})!`;
    const toast = await this.toastCtrl.create({ message, duration: 4000, position: 'top' });
    await toast.present();

    this.storageService.emitFindStorageList();
    this.navigationCtrl.back();
  };

  private handleDeleteError = async (storage: StorageWrite) => {
    const message = `Could not delete the storage: ${storage.name} (${storage.code})!`;
    const toast = await this.toastCtrl.create({ message, duration: 4000, position: 'top' });
    await toast.present();
  };
}
