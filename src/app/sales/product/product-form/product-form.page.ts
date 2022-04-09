/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { ProductDecoded } from 'src/models/sales/product';
import { ProductService } from 'src/services/sales/product';

export enum ProductFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-product-form',
  templateUrl: 'product-form.page.html',
  styleUrls: ['product-form.page.scss'],
})
export class ProductFormPage implements OnInit {
  public formMode: string;
  public productForm: FormGroup;

  private productId: number;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private productService: ProductService
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
    const { code, name, description } = this.productForm.value;

    if (this.isUpdate()) {
      await this.handleUpdate(code, name, description);
      return;
    }

    await this.handleCreate(code, name, description);
  }

  private async handleCreate(code: string, name: string, description: string) {
    const loading = await this.loadingCtrl.create({ message: 'Creating product...' });
    await loading.present();

    this.productService
      .createProduct(code, name, description)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('The product was successfully created!');
          this.productService.emitFindProductList();
          this.navCtrl.navigateBack('/home/modules/sales/products');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the product!');
        }
      );
  }

  private async handleUpdate(code: string, name: string, description: string) {
    const loading = await this.loadingCtrl.create({ message: 'Updating product...' });
    await loading.present();

    this.productService
      .updateProduct(this.productId, code, name, description)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('Successfully updated the product!');
          this.productService.emitFindProductList();
          this.navCtrl.navigateBack('/home/modules/sales/products');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the product!');
        },
      );
  }

  private async buildToast(message: string) {
    const toastConfig = { message, duration: 3000, keyboardClose: true };
    const toast = await this.toastCtrl.create({ ...toastConfig, position: 'top' });
    await toast.present();
  }

  private buildForm(product?: ProductDecoded) {
    const { code = '', name = '', description = '' } = product || {};
    this.productForm = new FormGroup({
      code: new FormControl(code, Validators.required),
      name: new FormControl(name, Validators.required),
      description: new FormControl(description, Validators.nullValidator)
    });
  }

  private buildUpdateForm() {
    this.productId = this.route.snapshot.params.product_id;
    this.productService.findProductById(this.productId).subscribe(
      (product: ProductDecoded) => this.buildForm(product),
    );
  }

  private isUpdate(): boolean {
    return this.formMode === ProductFormMode.update;
  }
}
