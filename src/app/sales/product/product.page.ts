import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  NavController,
  ToastController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ProductDecoded } from 'src/models/sales/product';
import { ProductService } from 'src/services/sales/product';

@Component({
  selector: 'app-page-product',
  templateUrl: 'product.page.html'
})
export class ProductPage implements OnInit, OnDestroy {
  public productList: ProductDecoded[];

  private subscription$: Subscription;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private productService: ProductService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.productService.listenFindProductList(
      (productList: ProductDecoded[]) => this.productList = productList,
    );

    this.productService.emitFindProductList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  handleCreateClick() {
    this.navCtrl.navigateForward('/home/modules/sales/products/create');
  }

  handleUpdateClick(payload: ProductDecoded) {
    this.navCtrl.navigateForward(`/home/modules/sales/products/update/${payload.id}`);
  }

  public async handleActionSheetClick(payload: ProductDecoded) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () =>
        this.productService.deleteProduct(payload.id)
          .toPromise()
          .then(this.handleDeleteSuccess)
          .catch(this.handleDeleteError)
    }, {
      text: 'Update',
      icon: 'pencil-outline',
      handler: () => this.handleUpdateClick(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Products Operations', buttons });
    await actionSheet.present();
  }

  handleDeleteSuccess = async () => {
    const message = 'Product was successfully deleted!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
    this.productService.emitFindProductList();
  };

  handleDeleteError = async () => {
    const message = 'Could not delete this product!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };
}
