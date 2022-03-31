import { Component } from '@angular/core';
import { InventoryPage } from '../inventory/inventory.page';
import { FinancePage } from '../finance/finance';
import { SalesPage } from '../sales/sales';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './dashboard.html'
})
export class DashboardPage {
  inventoryPage = InventoryPage;
  financePage = FinancePage;
  salesPage = SalesPage;
}
