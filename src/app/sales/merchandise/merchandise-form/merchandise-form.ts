import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { MerchandiseWrite } from '../../../../models/sales/merchandiseandise';
import { ProductRead } from '../../../../models/sales/product';
import { MerchandiseService } from '../../../../services/sales/merchandise';
import { ProductService } from '../../../../services/sales/product';
import { PresentationUtil } from '../../../../utils/presentation';

export enum MerchandiseFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-merchandise-form',
  templateUrl: './merchandise-form.html'
})
export class MerchandiseFormPage implements OnInit {
  mode: string = MerchandiseFormMode.Create;
  merchandise: MerchandiseWrite;
  merchandiseForm: FormGroup;
  productList: ProductRead[];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private merchandiseService: MerchandiseService,
              productService: ProductService) {
    productService.findProducts()
      .subscribe((productList: ProductRead[]) => {
        this.productList = productList;
      });
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.merchandise = this.navParams.get('merchandise');
    }
    this.createForm();
  }

  onSubmit() {
    const {
      retail_price,
      purchase_price,
      product_id
    } = this.merchandiseForm.value;

    const merchandise = new MerchandiseWrite(retail_price, purchase_price, { product_id });
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating merchandise...');
      this.merchandiseService
        .updateMerchandise(this.merchandise.id, merchandise)
        .subscribe(() => this.onFinishMerchandiseOperation('The merchandise was successfully updated!', loading));
    } else {
      const loading = this.presentationUtil.createLoading('Creating merchandise...');
      this.merchandiseService
        .createMerchandise(merchandise)
        .subscribe(() => this.onFinishMerchandiseOperation('A merchandise was successfully created!', loading));
    }
  }

  private onFinishMerchandiseOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.merchandiseService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let retail_price = '';
    let purchase_price = '';
    let product_id = null;
    if (this.isUpdate()) {
      ({
        retail_price,
        purchase_price,
        product_id
      } = this.merchandise);
    }
    this.merchandiseForm = new FormGroup({
      retail_price: new FormControl(retail_price, [
        Validators.required,
        Validators.min(0)
      ]),
      purchase_price: new FormControl(purchase_price, [
        Validators.required,
        Validators.min(0)
      ]),
      product_id: new FormControl(product_id || '', Validators.required)
    });
  }

  private isUpdate() {
    return this.mode === MerchandiseFormMode.Update;
  }
}
