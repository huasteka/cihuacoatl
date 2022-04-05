import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BudgetCategoryPage } from './budget-category.page';
import { BudgetCategoryFormPage, BudgetCategoryFormMode } from './budget-category-form/budget-category-form.page';

const routes: Routes = [
  {
    path: '',
    component: BudgetCategoryPage,
  },
  {
    path: 'create',
    component: BudgetCategoryFormPage,
    data: { formMode: BudgetCategoryFormMode.create },
  },
  {
    path: 'update/:budgetCategoryId',
    component: BudgetCategoryFormPage,
    data: { formMode: BudgetCategoryFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetCategoryRoutingModule { }
