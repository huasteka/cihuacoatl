import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OperationType } from 'src/models/sales/response';

import { OperationPage } from './operation.page';
import { OperationDetailPage } from './operation-detail/operation-detail.page';
import { OperationFormPage } from './operation-form/operation-form.page';

const routes: Routes = [
  {
    path: '',
    component: OperationPage,
  },
  {
    path: 'purchase',
    component: OperationFormPage,
    data: { operationType: OperationType.operationPurchase },
  },
  {
    path: 'sale',
    component: OperationFormPage,
    data: { operationType: OperationType.operationSale },
  },
  {
    path: 'details/:operation_id',
    component: OperationDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
