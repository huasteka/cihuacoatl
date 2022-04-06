import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaymentTypePage } from './payment-type.page';
import { PaymentTypeFormPage, PaymentTypeFormMode } from './payment-type-form/payment-type-form.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentTypePage,
  },
  {
    path: 'create',
    component: PaymentTypeFormPage,
    data: { formMode: PaymentTypeFormMode.create },
  },
  {
    path: 'update/:paymentTypeId',
    component: PaymentTypeFormPage,
    data: { formMode: PaymentTypeFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentTypeRoutingModule { }
