/* eslint-disable @typescript-eslint/naming-convention */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ClientDecoded } from 'src/models/sales/client';
import { MerchandiseDecoded } from 'src/models/sales/merchandise';
import { PurchaseMerchandiseWrite } from 'src/models/sales/purchase';
import { OperationType } from 'src/models/sales/response';
import { SaleMerchandiseWrite } from 'src/models/sales/sale';
import { SupplierDecoded } from 'src/models/sales/supplier';

export interface OperationMerchandiseEvent {
  item: PurchaseMerchandiseWrite | SaleMerchandiseWrite;
  price: number;
}

@Component({
  selector: 'app-operation-merchandise-form',
  templateUrl: 'operation-merchandise-form.component.html',
  styleUrls: ['operation-merchandise-form.component.scss'],
})
export class OperationMerchandiseFormComponent implements OnInit {
  @Input()
  public operationType: OperationType;

  @Input()
  public clientList: ClientDecoded[];

  @Input()
  public supplierList: SupplierDecoded[];

  @Input()
  public merchandiseList: MerchandiseDecoded[];

  @Output()
  public submitModal = new EventEmitter<OperationMerchandiseEvent>();

  @Output()
  public closeModal = new EventEmitter<void>();

  public merchandiseForm: FormGroup;

  public ngOnInit(): void {
    this.merchandiseForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

    if (this.operationType === OperationType.operationPurchase) {
      this.merchandiseForm.addControl('supplier_id', new FormControl(null, [Validators.required]));
      this.merchandiseForm.addControl('purchase_price', new FormControl(null, [Validators.required]));
    } else {
      this.merchandiseForm.addControl('client_id', new FormControl(null, [Validators.required]));
      this.merchandiseForm.addControl('retail_price', new FormControl(null, [Validators.required]));
    }
  }

  public handleProductSelect($event: Event): void {
    const merchandiseId = ($event as CustomEvent).detail.value;
    const merchandise = this.merchandiseList.find((m) => m.id === merchandiseId);
    if (merchandise !== null) {
      if (this.isPurchase()) {
        this.merchandiseForm.get('purchase_price').setValue(merchandise.purchase_price);
      } else {
        this.merchandiseForm.get('retail_price').setValue(merchandise.retail_price);
      }
    }
  }

  public handleMerchandiseSubmit(): void {
    let operationProduct = null;
    let operationPrice = 0;
    if (this.isPurchase()) {
      operationProduct = this.merchandiseForm.value as PurchaseMerchandiseWrite;
      operationPrice = operationProduct.purchase_price * operationProduct.quantity;
    } else {
      operationProduct = this.merchandiseForm.value as SaleMerchandiseWrite;
      operationPrice = operationProduct.retail_price * operationProduct.quantity;
    }

    this.submitModal.emit({ item: operationProduct, price: operationPrice });
  }

  public handleCloseModal(): void {
    this.closeModal.emit();
  }

  public isPurchase(): boolean {
    return this.operationType === OperationType.operationPurchase;
  }
}
