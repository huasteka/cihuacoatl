import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemPage } from './item.page';
import { ItemFormPage, ItemFormMode } from './item-form/item-form.page';

const routes: Routes = [
  {
    path: '',
    component: ItemPage,
  },
  {
    path: 'create',
    component: ItemFormPage,
    data: { formMode: ItemFormMode.create },
  },
  {
    path: 'update/:itemId',
    component: ItemFormPage,
    data: { formMode: ItemFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
