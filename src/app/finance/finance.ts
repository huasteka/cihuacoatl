import { Component } from '@angular/core';
import { AccountPage } from './account/account';
import { BudgetGroupPage } from './budget-group/budget-group';
import { PaymentTypePage } from './payment-type/payment-type';
import { BudgetCategoryPage } from './budget-category/budget-category';

@Component({
  selector: 'page-finance',
  templateUrl: './finance.html'
})
export class FinancePage {
  accountPage = AccountPage;
  budgetGroupPage = BudgetGroupPage;
  budgetCategoryPage = BudgetCategoryPage;
  paymentTypePage = PaymentTypePage;
}
