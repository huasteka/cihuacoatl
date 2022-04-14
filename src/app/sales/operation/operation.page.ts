/* eslint-disable @typescript-eslint/naming-convention */
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PurchaseDecoded } from 'src/models/sales/purchase';
import { OperationType } from 'src/models/sales/response';
import { SaleDecoded } from 'src/models/sales/sale';
import { PurchaseService } from 'src/services/sales/purchase';
import { SaleService } from 'src/services/sales/sale';

@Component({
  selector: 'app-operation-page',
  templateUrl: 'operation.page.html',
  styleUrls: ['operation.page.scss'],
})
export class OperationPage implements OnInit, OnDestroy {
  public selectedOperationType: string;
  public operationType = OperationType;
  public operationList: Array<PurchaseDecoded | SaleDecoded> = [];

  private purchaseSubscription$: Subscription;
  private saleSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private currencyPipe: CurrencyPipe,
    private purchaseService: PurchaseService,
    private saleService: SaleService,
  ) { }

  public ionViewWillEnter() {
    const selectedOperationType = this.route.snapshot.queryParams?.operationType;
    if (selectedOperationType) {
      this.selectedOperationType = selectedOperationType;
    }
  }

  public ngOnInit(): void {
    this.purchaseSubscription$ = this.purchaseService.listenFindPurchaseList(
      (operationList: PurchaseDecoded[]) => {
        if (this.selectedOperationType === OperationType.operationPurchase) {
          this.operationList = operationList;
        }
      }
    );

    this.saleSubscription$ = this.saleService.listenFindSaleList(
      (operationList: SaleDecoded[]) => {
        if (this.selectedOperationType === OperationType.operationSale) {
          this.operationList = operationList;
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.purchaseSubscription$?.unsubscribe();
    this.saleSubscription$?.unsubscribe();
  }

  public handleSelectOperationTypeClick($event: Event): void {
    this.selectedOperationType = ($event as CustomEvent).detail.value;
    if (this.selectedOperationType === OperationType.operationPurchase) {
      this.purchaseService.emitFindPurchaseList();
    } else {
      this.saleService.emitFindSaleList();
    }
  }

  public handlePurchaseClick(): void {
    this.navCtrl.navigateForward(`/home/operations/sales/purchase`);
  }

  public handleSaleClick(): void {
    this.navCtrl.navigateForward(`/home/operations/sales/sale`);
  }

  public handleDetailClick(operation: PurchaseDecoded): void {
    this.navCtrl.navigateForward(`/home/operations/sales/details/${operation.id}`);
  }

  public getOperationClass() {
    return {
      'operation-purchase': this.selectedOperationType === OperationType.operationPurchase,
      'operation-sale': this.selectedOperationType === OperationType.operationSale,
    };
  }

  public getOperationValue(price: number): string {
    let fixedPrice = parseFloat('' + price);
    fixedPrice = this.selectedOperationType === OperationType.operationSale
      ? fixedPrice
      : fixedPrice * -1;
    return this.currencyPipe.transform(fixedPrice);
  }
}
