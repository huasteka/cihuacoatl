import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ClientService } from 'src/services/sales/client';
import { MerchandiseService } from 'src/services/sales/merchandise';
import { PurchaseService } from 'src/services/sales/purchase';
import { SaleService } from 'src/services/sales/sale';
import { SupplierService } from 'src/services/sales/supplier';

import { OperationPage } from './operation.page';
import { OperationDetailPage } from './operation-detail/operation-detail.page';
import { OperationFormPage } from './operation-form/operation-form.page';
import { OperationMerchandiseFormComponent } from './operation-merchandise-form/operation-merchandise-form.component';
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
    OperationMerchandiseFormComponent,
  ],
  providers: [
    CurrencyPipe,
    PurchaseService,
    SaleService,
    ClientService,
    SupplierService,
    MerchandiseService,
  ]
})
export class OperationPageModule { }
