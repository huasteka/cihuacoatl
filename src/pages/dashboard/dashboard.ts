import { Component } from '@angular/core';
import { InventoryPage } from '../inventory/inventory';

@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.html'
})
export class DashboardPage {
  inventoryPage = InventoryPage;

}
