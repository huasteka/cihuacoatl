import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OperationPage } from './operation.page';
import { OperationDetailPage } from './operation-detail/operation-detail.page';
import { OperationFormPage, OperationFormType } from './operation-form/operation-form.page';

const routes: Routes = [
  {
    path: '',
    component: OperationPage,
  },
  {
    path: 'purchase',
    component: OperationFormPage,
    data: { formMode: OperationFormType.operationPurchase },
  },
  {
    path: 'sale',
    component: OperationFormPage,
    data: { formMode: OperationFormType.operationSale },
  },
  {
    path: 'detail/:operation_id',
    component: OperationDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
