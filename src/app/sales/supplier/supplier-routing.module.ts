import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SupplierPage } from './supplier.page';
import { SupplierFormPage, SupplierFormMode } from './supplier-form/supplier-form.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierPage,
  },
  {
    path: 'create',
    component: SupplierFormPage,
    data: { formMode: SupplierFormMode.create },
  },
  {
    path: 'update/:supplier_id',
    component: SupplierFormPage,
    data: { formMode: SupplierFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
