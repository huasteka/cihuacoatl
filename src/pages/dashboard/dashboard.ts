import { Component } from '@angular/core';
import { InventoryPage } from '../inventory/inventory';
import { FinancePage } from '../finance/finance';

@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.html'
})
export class DashboardPage {
  inventoryPage = InventoryPage;
  financePage = FinancePage;
}
