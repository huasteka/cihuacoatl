/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ClientDecoded } from 'src/models/sales/client';
import { MerchandiseDecoded } from 'src/models/sales/merchandise';
import { PurchaseWrite, PurchaseMerchandiseWrite } from 'src/models/sales/purchase';
import { OperationType } from 'src/models/sales/response';
import { SaleWrite, SaleMerchandiseWrite } from 'src/models/sales/sale';
import { SupplierDecoded } from 'src/models/sales/supplier';
import { ClientService } from 'src/services/sales/client';
import { MerchandiseService } from 'src/services/sales/merchandise';
import { PurchaseService } from 'src/services/sales/purchase';
import { SaleService } from 'src/services/sales/sale';
import { SupplierService } from 'src/services/sales/supplier';
import { OperationMerchandiseEvent } from '../operation-merchandise-form/operation-merchandise-form.component';

interface RecordMap<T> {
  [id: number]: T;
}

@Component({
  selector: 'app-operation-form-page',
  templateUrl: 'operation-form.page.html',
  styleUrls: ['operation-form.page.scss'],
})
export class OperationFormPage implements OnInit, OnDestroy {
  public isModalOpen = false;
  public operationType: OperationType;
  public operationForm: FormGroup;
  public merchandiseForm: FormGroup;
  public clientMap: RecordMap<ClientDecoded>;
  public supplierMap: RecordMap<SupplierDecoded>;
  public merchandiseMap: RecordMap<MerchandiseDecoded>;
  public operationMerchandiseList: Array<PurchaseMerchandiseWrite | SaleMerchandiseWrite> = [];

  private clientSubscription$: Subscription;
  private supplierSubscription$: Subscription;
  private merchandiseSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private purchaseService: PurchaseService,
    private saleService: SaleService,
    private clientService: ClientService,
    private supplierService: SupplierService,
    private merchandiseService: MerchandiseService,
  ) { }

  public ngOnInit(): void {
    this.operationType = this.route.snapshot.data.operationType;

    if (this.operationType === OperationType.operationPurchase) {
      this.loadSupplierList();
    } else {
      this.loadClientList();
    }
    this.loadMerchandiseList();

    this.operationForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.nullValidator]),
      gross_value: new FormControl(0, [Validators.required, Validators.min(0)]),
      discount: new FormControl(0, [Validators.nullValidator]),
      net_value: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }

  public ngOnDestroy(): void {
    this.clientSubscription$?.unsubscribe();
    this.supplierSubscription$?.unsubscribe();
    this.merchandiseSubscription$.unsubscribe();
  }

  public getMerchandise(merchandiseId: number): MerchandiseDecoded {
    return this.merchandiseMap[merchandiseId];
  }

  public getClient(item: any): ClientDecoded {
    const clientId = +(item as SaleMerchandiseWrite).client_id;
    return this.clientMap[clientId];
  }

  public getSupplier(item: any): SupplierDecoded {
    const supplierId = +(item as PurchaseMerchandiseWrite).supplier_id;
    return this.supplierMap[supplierId];
  }

  public getPrice(item: any): number {
    if (this.isPurchase()) {
      return (item as PurchaseMerchandiseWrite).purchase_price;
    }
    return (item as SaleMerchandiseWrite).retail_price;
  }

  public getCollection(collection?: RecordMap<any>): any[] {
    return collection ? Object.values(collection) : [];
  }

  public calculateNetValue(): void {
    const { gross_value, discount } = this.operationForm.value;

    if (gross_value < discount) {
      this.operationForm.get('discount').setValue(gross_value);
    } else {
      this.operationForm.get('net_value').setValue(gross_value - discount);
    }
  }

  public handleOpenModal(): void {
    this.isModalOpen = true;
  }

  public handleCloseModal(): void {
    this.isModalOpen = false;
  }

  public handleMerchandiseSubmit(event: OperationMerchandiseEvent): void {
    this.operationForm.get('gross_value').setValue(this.operationForm.value.gross_value + event.price);
    this.operationMerchandiseList.push(event.item);
    this.calculateNetValue();
    this.handleCloseModal();
  }

  public handleRemoveMerchandise(merchandiseIndex: any): void {
    let merchandisePrice = 0;
    if (this.isPurchase()) {
      const { purchase_price, quantity } = this.operationMerchandiseList[merchandiseIndex] as PurchaseMerchandiseWrite;
      merchandisePrice = purchase_price * quantity;
    } else {
      const { retail_price, quantity } = this.operationMerchandiseList[merchandiseIndex] as SaleMerchandiseWrite;
      merchandisePrice = retail_price * quantity;
    }

    this.operationMerchandiseList.splice(merchandiseIndex, 1);
    this.operationForm.get('gross_value').setValue(this.operationForm.value.gross_value - merchandisePrice);
    this.calculateNetValue();
  }

  public isPurchase(): boolean {
    return this.operationType === OperationType.operationPurchase;
  }

  public async handleSubmit(): Promise<void> {
    if (this.isPurchase()) {
      const operation = this.operationForm.value as PurchaseWrite;
      operation.merchandises = this.operationMerchandiseList as PurchaseMerchandiseWrite[];
      await this.handlePurchase(operation);
    } else {
      const operation = this.operationForm.value as SaleWrite;
      operation.merchandises = this.operationMerchandiseList as SaleMerchandiseWrite[];
      await this.handleSale(operation);
    }
  }

  private async handlePurchase(operation: PurchaseWrite) {
    const loading = await this.loadingCtrl.create({ message: 'Creating the purchase order...' });
    await loading.present();

    this.purchaseService
      .createPurchase(operation)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('The purchase order was successfully created!');
          this.purchaseService.emitFindPurchaseList();
          const queryParams = { operationType: this.operationType };
          this.navigationCtrl.navigateBack('/home/operations/sales', { queryParams });
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('It was not possible to create the purchase order!');
        }
      );
  }

  private async handleSale(operation: SaleWrite) {
    const loading = await this.loadingCtrl.create({ message: 'Creating the sale order...' });
    await loading.present();

    this.saleService
      .createSale(operation)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('The sale order was successfully created!');
          this.saleService.emitFindSaleList();
          const queryParams = { operationType: this.operationType };
          this.navigationCtrl.navigateBack('/home/operations/sales', { queryParams });
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('It was not possible to create the sale order!');
        }
      );
  }

  private async buildToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top', keyboardClose: true });
    await toast.present();
  }

  private loadClientList() {
    this.clientSubscription$ = this.clientService.listenFindClientList(
      (clientList: ClientDecoded[]) => this.clientMap = this.convertMap(clientList),
    );

    this.clientService.emitFindClientList();
  }

  private loadSupplierList() {
    this.supplierSubscription$ = this.supplierService.listenFindSupplierList(
      (supplierList: SupplierDecoded[]) => this.supplierMap = this.convertMap(supplierList),
    );

    this.supplierService.emitFindSupplierList();
  }

  private loadMerchandiseList() {
    this.merchandiseSubscription$ = this.merchandiseService.listenFindMerchandiseList(
      (merchandiseList: MerchandiseDecoded[]) => this.merchandiseMap = this.convertMap(merchandiseList),
    );

    this.merchandiseService.emitFindMerchandiseList();
  }

  private convertMap(collection: any[]): RecordMap<any> {
    return collection.reduce((m, t) => ({ ...m, [t.id]: t }), {});
  }
}
