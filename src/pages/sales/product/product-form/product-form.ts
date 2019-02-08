import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { ProductWrite } from '../../../../models/product';
import { ProductService } from '../../../../services/sales/product';
import { PresentationUtil } from '../../../../utils/presentation';

export enum ProductFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-product-form',
  templateUrl: './product-form.html'
})
export class ProductFormPage implements OnInit {
  mode: string = ProductFormMode.Create;
  product: ProductWrite;
  productForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private productService: ProductService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.product = this.navParams.get('product');
    }
    this.createForm();
  }

  onSubmit() {
    const {code, name, description} = this.productForm.value;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating measure unit...');
      this.productService
        .updateProduct(this.product.id, code, name, description)
        .subscribe(() => this.onFinishProductOperation(
          'Successfully updated the measure unit!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating measure unit...');
      this.productService
        .createProduct(code, name, description)
        .subscribe(() => this.onFinishProductOperation(
          'A measure unit was successfully created!',
          loading
        ));
    }
  }

  private onFinishProductOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.productService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let name = '';
    let code = '';
    let description = '';
    if (this.isUpdate()) {
      ({code, name, description} = this.product);
    }
    this.productForm = new FormGroup({
      code: new FormControl(code, Validators.required),
      name: new FormControl(name, Validators.required),
      description: new FormControl(description)
    });
  }

  private isUpdate(): boolean {
    return this.mode === ProductFormMode.Update;
  }
}
