import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MerchandisePurchased, PurchaseDecoded } from 'src/models/sales/purchase';
import { OperationType } from 'src/models/sales/response';
import { MerchandiseSold, SaleDecoded } from 'src/models/sales/sale';
import { PurchaseService } from 'src/services/sales/purchase';
import { SaleService } from 'src/services/sales/sale';

@Component({
  selector: 'app-operation-detail-page',
  templateUrl: 'operation-detail.page.html',
  styleUrls: ['operation-detail.page.scss'],
})
export class OperationDetailPage implements OnInit {
  public selectedOperation: PurchaseDecoded | SaleDecoded;
  public operationType: string;

  private operationId: number;

  constructor(
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private purchaseService: PurchaseService,
    private saleService: SaleService,
  ) { }

  public ngOnInit(): void {
    this.operationId = parseInt(this.route.snapshot.params.operation_id, 10);
    this.operationType = this.route.snapshot.queryParams.operationType;

    if (this.operationType === OperationType.operationPurchase) {
      this.purchaseService.findPurchaseById(this.operationId).subscribe(
        (purchase: PurchaseDecoded) => this.selectedOperation = purchase,
      );
    } else {
      this.saleService.findSaleById(this.operationId).subscribe(
        (sale: SaleDecoded) => this.selectedOperation = sale,
      );
    }
  }

  public getDefaultHref() {
    return `/home/operations/sales?operationType=${this.operationType}`;
  }

  public getPurchasedMerchandises(): MerchandisePurchased[] {
    if (this.operationType === OperationType.operationSale) {
      return [];
    }

    return (this.selectedOperation as PurchaseDecoded).merchandises_purchased;
  }

  public getSoldMerchandises(): MerchandiseSold[] {
    if (this.operationType === OperationType.operationPurchase) {
      return [];
    }

    return (this.selectedOperation as SaleDecoded).merchandises_sold;
  }

  public getCurrency(amount: number): string {
    return this.currencyPipe.transform(amount || 0);
  }
}
