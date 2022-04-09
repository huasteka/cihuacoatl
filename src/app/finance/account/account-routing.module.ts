import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountPage } from './account.page';
import { AccountFormPage, AccountFormMode } from './account-form/account-form.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
  },
  {
    path: 'create',
    component: AccountFormPage,
    data: { formMode: AccountFormMode.create },
  },
  {
    path: 'update/:accountId',
    component: AccountFormPage,
    data: { formMode: AccountFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
