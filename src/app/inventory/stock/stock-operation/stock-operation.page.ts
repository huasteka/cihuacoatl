/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ItemRead } from 'src/models/inventory/item';
import { StorageRead } from 'src/models/inventory/storage';
import { OperationWrite, StockType } from 'src/models/inventory/stock';
import { ItemService } from 'src/services/inventory/item';
import { StockService } from 'src/services/inventory/stock';
import { StorageService } from 'src/services/inventory/storage';


@Component({
  selector: 'app-page-stock-operation',
  templateUrl: 'stock-operation.page.html',
  styleUrls: ['stock-operation.page.scss'],
})
export class StockOperationPage implements OnInit, OnDestroy {
  public stockType: StockType;
  public stockForm: FormGroup;
  public storageList: StorageRead[];
  public itemList: ItemRead[];

  private storageSubscription$: Subscription;
  private itemSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storageService: StorageService,
    private itemService: ItemService,
    private stockService: StockService
  ) { }

  public ngOnInit(): void {
    this.stockType = this.route.snapshot.data.stockType;

    this.storageSubscription$ = this.storageService.listenFindStorageList(
      (storageList: StorageRead[]) => this.storageList = storageList,
    );

    this.itemSubscription$ = this.itemService.listenFindItemList(
      (itemList: ItemRead[]) => this.itemList = itemList,
    );

    this.storageService.emitFindStorageList();
    this.itemService.emitFindItemList();

    const storageId = this.route.snapshot.queryParams.storage_id;

    this.stockForm = new FormGroup({
      storage_id: new FormControl(storageId, Validators.required),
      item_id: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
    });
  }

  public ngOnDestroy(): void {
    this.itemSubscription$.unsubscribe();
    this.storageSubscription$.unsubscribe();
  }

  public async handleSubmit(): Promise<void> {
    const { storage_id, item_id, quantity } = this.stockForm.value;

    if (this.isDeposit()) {
      await this.handleDeposit({ storage_id, item_id, quantity });
    } else {
      await this.handleWithdraw({ storage_id, item_id, quantity });
    }
  }

  public isDeposit(): boolean {
    return this.stockType === StockType.storageDeposit;
  }

  private async handleDeposit(operation: OperationWrite): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Creating a storage deposit...' });
    await loading.present();

    this.stockService
      .depositIntoStock(operation)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('The item was successfully deposited into storage!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('It was not possible to deposit into storage!');
        }
      );
  }

  private async handleWithdraw(operation: OperationWrite): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Creating a deposit withdraw...' });
    await loading.present();

    this.stockService
      .withdrawFromStock(operation)
      .subscribe(
        async () => {
          await loading.dismiss();
          this.handleSubscribe('The item was successfully withdrawn from storage!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('It was not possible to withdraw from storage!');
        }
      );
  }

  private async buildToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }

  private async handleSubscribe(message: string) {
    await this.buildToast(message);
    this.stockService.emitFindOperationList(this.stockForm.value.storage_id);
    this.navigationCtrl.navigateBack('/home/operations/stock');
  }

}
