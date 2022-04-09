/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { MerchandiseDecoded } from 'src/models/sales/merchandise';
import { ProductService } from 'src/services/sales/product';
import { MerchandiseService } from 'src/services/sales/merchandise';
import { ProductDecoded } from 'src/models/sales/product';

export enum MerchandiseFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-merchandise-form',
  templateUrl: 'merchandise-form.page.html',
  styleUrls: ['merchandise-form.page.scss'],
})
export class MerchandiseFormPage implements OnInit {
  public formMode: string;
  public merchandiseForm: FormGroup;
  public productList: ProductDecoded[];

  private merchandiseId: number;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private productService: ProductService,
    private merchandiseService: MerchandiseService
  ) { }

  public ngOnInit(): void {
    this.formMode = this.route.snapshot.data.formMode;

    if (this.isUpdate()) {
      this.buildUpdateForm();
      return;
    }

    this.buildForm();
  }

  public async handleSubmit(): Promise<void> {
    const { product_id, retail_price, purchase_price } = this.merchandiseForm.value;

    if (this.isUpdate()) {
      await this.handleUpdate(product_id, retail_price, purchase_price);
      return;
    }

    await this.handleCreate(product_id, retail_price, purchase_price);
  }

  private async handleCreate(product_id: number, retail_price: number, purchase_price: number) {
    const loading = await this.loadingCtrl.create({ message: 'Creating merchandise...' });
    await loading.present();

    this.merchandiseService
      .createMerchandise(product_id, retail_price, purchase_price)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('The merchandise was successfully created!');
          this.merchandiseService.emitFindMerchandiseList();
          this.navCtrl.navigateBack('/home/modules/sales/merchandises');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the merchandise!');
        }
      );
  }

  private async handleUpdate(product_id: number, retail_price: number, purchase_price: number) {
    const loading = await this.loadingCtrl.create({ message: 'Updating merchandise...' });
    await loading.present();

    this.merchandiseService
      .updateMerchandise(this.merchandiseId, product_id, retail_price, purchase_price)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('Successfully updated the merchandise!');
          this.merchandiseService.emitFindMerchandiseList();
          this.navCtrl.navigateBack('/home/modules/sales/merchandises');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the merchandise!');
        },
      );
  }

  private async buildToast(message: string) {
    const toastConfig = { message, duration: 3000, keyboardClose: true };
    const toast = await this.toastCtrl.create({ ...toastConfig, position: 'top' });
    await toast.present();
  }

  private buildForm(merchandise?: MerchandiseDecoded) {
    this.loadProducts();

    const { product = null, retail_price = 0, purchase_price = 0 } = merchandise || {};
    const productId = product === null ? null : +product.id;
    this.merchandiseForm = new FormGroup({
      product_id: new FormControl(productId, Validators.required),
      retail_price: new FormControl(retail_price, [Validators.required, Validators.min(0)]),
      purchase_price: new FormControl(purchase_price, [Validators.required, Validators.min(0)])
    });
  }

  private buildUpdateForm() {
    this.merchandiseId = this.route.snapshot.params.merchandise_id;
    this.merchandiseService.findMerchandiseById(this.merchandiseId).subscribe(
      (merchandise: MerchandiseDecoded) => this.buildForm(merchandise),
    );
  }

  private loadProducts() {
    this.productService.listenFindProductList(
      (productList: ProductDecoded[]) => this.productList = productList,
    );
    this.productService.emitFindProductList();
  }

  private isUpdate(): boolean {
    return this.formMode === MerchandiseFormMode.update;
  }
}
