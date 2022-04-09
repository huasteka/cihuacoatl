import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MerchandisePage } from './merchandise.page';
import { MerchandiseFormPage, MerchandiseFormMode } from './merchandise-form/merchandise-form.page';

const routes: Routes = [
  {
    path: '',
    component: MerchandisePage,
  },
  {
    path: 'create',
    component: MerchandiseFormPage,
    data: { formMode: MerchandiseFormMode.create },
  },
  {
    path: 'update/:merchandise_id',
    component: MerchandiseFormPage,
    data: { formMode: MerchandiseFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchandiseRoutingModule { }
