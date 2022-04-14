import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { OperationStockRead } from 'src/models/inventory/stock';

@Component({
  selector: 'app-page-stock-detail',
  templateUrl: 'stock-detail.page.html',
  styleUrls: ['stock-detail.page.scss'],
})
export class StockDetailPage implements OnInit {
  public selectedStock: OperationStockRead;

  constructor(
    private location: Location,
    private navigationCtrl: NavController,
  ) { }

  public ngOnInit(): void {
    this.selectedStock = this.location.getState() as OperationStockRead;

    if (!this.selectedStock?.id) {
      this.navigationCtrl.navigateBack('/home/operations/stock');
    }
  }
}
