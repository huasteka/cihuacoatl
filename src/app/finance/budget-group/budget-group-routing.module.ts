import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BudgetGroupPage } from './budget-group.page';
import { BudgetGroupFormPage, BudgetGroupFormMode } from './budget-group-form/budget-group-form.page';

const routes: Routes = [
  {
    path: '',
    component: BudgetGroupPage,
  },
  {
    path: 'create',
    component: BudgetGroupFormPage,
    data: { formMode: BudgetGroupFormMode.create },
  },
  {
    path: 'update/:budgetGroupId',
    component: BudgetGroupFormPage,
    data: { formMode: BudgetGroupFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetGroupRoutingModule { }
