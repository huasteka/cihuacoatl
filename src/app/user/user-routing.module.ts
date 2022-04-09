import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangeNamePage } from './change-name/change-name.page';
import { ChangePasswordPage } from './change-password/change-password.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeNamePage,
  },
  {
    path: 'security',
    component: ChangePasswordPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
