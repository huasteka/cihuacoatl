/* eslint-disable @typescript-eslint/naming-convention */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';


import { OperationStockRead } from 'src/models/inventory/stock';
import { StockService } from 'src/services/inventory/stock';

@Component({
  selector: 'app-page-stock-set-minimum',
  templateUrl: 'stock-set-minimum.page.html',
  styleUrls: ['stock-set-minimum.page.scss'],
})
export class StockSetMinimumFormPage implements OnInit {
  public selectedStock: OperationStockRead;
  public stockForm: FormGroup;

  constructor(
    private location: Location,
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private stockService: StockService
  ) { }

  public ngOnInit(): void {
    this.selectedStock = this.location.getState() as OperationStockRead;

    if (!this.selectedStock?.id) {
      this.navigationCtrl.navigateBack('/home/operations/stock');
    }

    const { stock: { minimum_quantity = 0 } } = this.selectedStock.attributes;

    this.stockForm = new FormGroup({
      minimum_quantity: new FormControl(minimum_quantity, Validators.required)
    });
  }

  public async handleSubmit(): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Creating budget group...' });
    await loading.present();

    this.stockService
      .setMinimumQuantity(
        this.selectedStock.attributes.stock.id,
        this.stockForm.value.minimum_quantity
      )
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('Stock minimum quantity was successfully set!');
          this.navigationCtrl.navigateBack('/home/operations/stock');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not set the minimal quantity on stock!');
        },
      );
  }

  private async buildToast(message: string): Promise<void> {
    const toastConfig = { message, duration: 3000, keyboardClose: true };
    const toast = await this.toastCtrl.create({ ...toastConfig, position: 'top' });
    await toast.present();
  }

}
