import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { InventoryPage } from './inventory.page';
import { StorageChildPage } from './storage/storage-child/storage-child.page';
import { StorageFormMode, StorageFormPage } from './storage/storage-form/storage-form.page';
import { StoragePage } from './storage/storage.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryPage,
  },
  {
    path: 'storages',
    component: StoragePage,
  },
  {
    path: 'storages/create',
    component: StorageFormPage,
    data: { formMode: StorageFormMode.create },
  },
  {
    path: 'storages/:storageId/details',
    component: StorageChildPage,
  },
  {
    path: 'storages/:storageId/update',
    component: StorageFormPage,
    data: { formMode: StorageFormMode.update },
  },
  {
    path: 'storages/:storageId/append',
    component: StorageFormPage,
    data: { formMode: StorageFormMode.append },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class InventoryPageRoutingModule { }
