import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductPage } from './product.page';
import { ProductFormPage, ProductFormMode } from './product-form/product-form.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage,
  },
  {
    path: 'create',
    component: ProductFormPage,
    data: { formMode: ProductFormMode.create },
  },
  {
    path: 'update/:product_id',
    component: ProductFormPage,
    data: { formMode: ProductFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
