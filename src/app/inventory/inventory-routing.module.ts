import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventoryPage } from './inventory.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryPage,
  },
  {
    path: 'storages',
    loadChildren: () => import('./storage/storage.module').then(m => m.UserModule),
  },
  {
    path: 'measure-units',
    loadChildren: () => import('./measure-unit/measure-unit.module').then(m => m.MeasureUnitModule),
  },
  {
    path: 'items',
    loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class InventoryPageRoutingModule { }
