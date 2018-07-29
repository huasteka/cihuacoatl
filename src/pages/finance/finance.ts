import { Component } from '@angular/core';
import { AccountPage } from './account/account';

@Component({
  selector: 'page-finance',
  templateUrl: './finance.html'
})
export class FinancePage {
  accountPage = AccountPage;
}
