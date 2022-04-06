import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FinancePage } from './finance.page';

const routes: Routes = [
  {
    path: '',
    component: FinancePage,
  },
  {
    path: 'budget-groups',
    loadChildren: () => import('./budget-group/budget-group.module').then(m => m.BudgetGroupModule),
  },
  {
    path: 'budget-categories',
    loadChildren: () => import('./budget-category/budget-category.module').then(m => m.BudgetCategoryModule),
  },
  {
    path: 'accounts',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
  },
  {
    path: 'payment-types',
    loadChildren: () => import('./payment-type/payment-type.module').then(m => m.PaymentTypeModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class FinancePageRoutingModule { }
