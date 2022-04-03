import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoragePage } from './storage.page';
import { StorageChildPage } from './storage-child/storage-child.page';
import { StorageFormPage, StorageFormMode } from './storage-form/storage-form.page';

const routes: Routes = [
  {
    path: '',
    component: StoragePage,
  },
  {
    path: 'create',
    component: StorageFormPage,
    data: { formMode: StorageFormMode.create },
  },
  {
    path: 'details/:storageId',
    component: StorageChildPage,
  },
  {
    path: 'update/:storageId',
    component: StorageFormPage,
    data: { formMode: StorageFormMode.update },
  },
  {
    path: 'append/:storageId',
    component: StorageFormPage,
    data: { formMode: StorageFormMode.append },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
