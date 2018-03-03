import { Component } from '@angular/core';

import { StoragePage } from './storage/storage';
import { MeasureUnitPage } from './measure-unit/measure-unit';

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html'
})
export class InventoryPage {
  storagePage = StoragePage;
  measureUnitPage = MeasureUnitPage;
}
