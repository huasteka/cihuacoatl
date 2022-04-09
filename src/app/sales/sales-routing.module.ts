import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalesPage } from './sales.page';

const routes: Routes = [
  {
    path: '',
    component: SalesPage,
  },
  {
    path: 'clients',
    loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
  },
  {
    path: 'suppliers',
    loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
  },
  {
    path: 'merchandises',
    loadChildren: () => import('./merchandise/merchandise.module').then(m => m.MerchandiseModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class SalesPageRoutingModule { }
