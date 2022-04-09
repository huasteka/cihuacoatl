import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientPage } from './client.page';
import { ClientFormPage, ClientFormMode } from './client-form/client-form.page';

const routes: Routes = [
  {
    path: '',
    component: ClientPage,
  },
  {
    path: 'create',
    component: ClientFormPage,
    data: { formMode: ClientFormMode.create },
  },
  {
    path: 'update/:client_id',
    component: ClientFormPage,
    data: { formMode: ClientFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
