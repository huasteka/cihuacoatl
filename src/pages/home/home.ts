import { Component } from '@angular/core';

import { InventoryPage } from '../inventory/inventory';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  inventoryPage = InventoryPage;

  constructor() {}

}
