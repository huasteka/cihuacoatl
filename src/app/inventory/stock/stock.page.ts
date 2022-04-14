/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { OperationStockRead, StockReadAttributes, StockType } from 'src/models/inventory/stock';
import { StorageRead } from 'src/models/inventory/storage';
import { StockService } from 'src/services/inventory/stock';
import { StorageService } from 'src/services/inventory/storage';

@Component({
  selector: 'app-page-stock',
  templateUrl: 'stock.page.html',
  styleUrls: ['stock.page.scss'],
})
export class StockPage implements OnInit, OnDestroy {
  public selectedStorageId: number;
  public storageList: StorageRead[];
  public stockList: OperationStockRead[];

  private storageSubscription$: Subscription;
  private stockSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storageService: StorageService,
    private stockService: StockService
  ) { }

  public ionViewWillEnter() {
    const selectedStorageId = this.route.snapshot.queryParams?.storageId;
    if (selectedStorageId) {
      this.selectedStorageId = selectedStorageId;
    }
  }

  public ngOnInit(): void {
    this.loadStorageList();

    this.stockSubscription$ = this.stockService.listenFindOperationList(
      (stockList: OperationStockRead[]) => this.stockList = stockList
    );
  }

  public ngOnDestroy(): void {
    this.storageSubscription$?.unsubscribe();
    this.stockSubscription$?.unsubscribe();
  }

  public handleSelectStorageClick($event: Event): void {
    this.selectedStorageId = ($event as CustomEvent).detail.value;
    this.stockService.emitFindOperationList(this.selectedStorageId);
  }

  public handleDepositClick(): void {
    const queryParams = this.selectedStorageId ? { storage_id: this.selectedStorageId } : {};
    this.navCtrl.navigateForward(`/home/operations/stock/deposit`, { queryParams });
  }

  public handleWithdrawClick(): void {
    const queryParams = this.selectedStorageId ? { storage_id: this.selectedStorageId } : {};
    this.navCtrl.navigateForward(`/home/operations/stock/withdraw`, { queryParams });
  }

  public handleDetailClick(stock: OperationStockRead): void {
    this.navCtrl.navigateForward(`/home/operations/stock/details`, { state: stock });
  }

  public getStockClass({ operation_type }: StockReadAttributes) {
    return {
      credit: operation_type === StockType.storageDeposit,
      debit: operation_type === StockType.storageWithdraw
    };
  }

  public getStockValue({ operation_type, quantity }: StockReadAttributes): number {
    const fixedQuantity = parseFloat('' + quantity);
    return operation_type === StockType.storageDeposit ? fixedQuantity : fixedQuantity * -1;
  }

  private loadStorageList() {
    this.storageSubscription$ = this.storageService.listenFindStorageList(
      (storageList: StorageRead[]) => this.storageList = storageList,
    );

    this.storageService.emitFindStorageList();
  }
}
