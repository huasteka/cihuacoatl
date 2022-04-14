import { Component, OnDestroy, OnInit } from '@angular/core';

export enum OperationFormType {
  operationPurchase = 'PURCHASE',
  operationSale = 'SALE',
}

@Component({
  selector: 'app-operation-form-page',
  templateUrl: 'operation-form.page.html',
  styleUrls: ['operation-form.page.scss'],
})
export class OperationFormPage implements OnInit, OnDestroy {
  constructor() { }

  public ngOnInit(): void {

  }

  public ngOnDestroy(): void {

  }
}
