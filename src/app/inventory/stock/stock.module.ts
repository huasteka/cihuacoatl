import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ItemService } from 'src/services/inventory/item';
import { StockService } from 'src/services/inventory/stock';
import { StorageService } from 'src/services/inventory/storage';

import { StockPage } from './stock.page';
import { StockOperationPage } from './stock-operation/stock-operation.page';
import { StockSetMinimumFormPage } from './stock-set-minimum/stock-set-minimum.page';
import { StockRoutingModule } from './stock-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StockRoutingModule,
  ],
  declarations: [
    StockPage,
    StockSetMinimumFormPage,
    StockOperationPage,
  ],
  providers: [
    StorageService,
    ItemService,
    StockService,
  ]
})
export class StockPageModule { }
