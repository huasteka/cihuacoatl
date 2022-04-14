import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PurchaseService } from 'src/services/sales/purchase';
import { SaleService } from 'src/services/sales/sale';

import { OperationPage } from './operation.page';
import { OperationDetailPage } from './operation-detail/operation-detail.page';
import { OperationFormPage } from './operation-form/operation-form.page';
import { OperationRoutingModule } from './operation-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OperationRoutingModule,
  ],
  declarations: [
    OperationPage,
    OperationDetailPage,
    OperationFormPage,
  ],
  providers: [
    CurrencyPipe,
    PurchaseService,
    SaleService,
  ]
})
export class OperationPageModule { }
