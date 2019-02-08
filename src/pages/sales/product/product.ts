import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { ProductFormMode, ProductFormPage } from './product-form/product-form';
import { ProductRead, ProductWrite } from '../../../models/product';
import { ProductService } from '../../../services/sales/product';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  productList: ProductRead[];

  constructor(private productService: ProductService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.productService.productListener
      .subscribe((productList: ProductRead[]) => {
        this.productList = productList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.productService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onProductCreate() {
    this.navCtrl.push(ProductFormPage, {mode: ProductFormMode.Create});
  }

  onProductDeleteSuccess = () => {
    this.productService.sendEventToListener();
    this.presentationUtil.createToast('The Product was successfully deleted!');
  };

  onProductDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this product!');
  };

  onProductActionSheet(payload: ProductRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.productService
          .deleteProduct(payload.id)
          .subscribe(this.onProductDeleteSuccess, this.onProductDeleteError);
      }
    }, {
      text: 'Update',
      icon: 'create',
      handler: () => this.onNavigateToForm(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];
    this.actionSheetCtrl.create({title: 'Product Operations', buttons}).present();
  }

  onNavigateToForm(payload: ProductRead) {
    this.navCtrl.push(ProductFormPage, {
      product: ProductWrite.createProduct(payload),
      mode: ProductFormMode.Update
    });
  }
}
