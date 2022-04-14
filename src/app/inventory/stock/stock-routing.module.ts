import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StockType } from 'src/models/inventory/stock';

import { StockPage } from './stock.page';
import { StockDetailPage } from './stock-detail/stock-detail.page';
import { StockOperationPage } from './stock-operation/stock-operation.page';
import { StockSetMinimumFormPage } from './stock-set-minimum/stock-set-minimum.page';

const routes: Routes = [
  {
    path: '',
    component: StockPage,
  },
  {
    path: 'details',
    component: StockDetailPage,
  },
  {
    path: 'deposit',
    component: StockOperationPage,
    data: { stockType: StockType.storageDeposit },
  },
  {
    path: 'withdraw',
    component: StockOperationPage,
    data: { stockType: StockType.storageWithdraw },
  },
  {
    path: 'set-minimum',
    component: StockSetMinimumFormPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
