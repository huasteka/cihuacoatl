import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  NavController,
  ToastController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { SupplierDecoded } from 'src/models/sales/supplier';
import { SupplierService } from 'src/services/sales/supplier';

@Component({
  selector: 'app-page-supplier',
  templateUrl: 'supplier.page.html'
})
export class SupplierPage implements OnInit, OnDestroy {
  public supplierList: SupplierDecoded[];

  private subscription$: Subscription;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private supplierService: SupplierService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.supplierService.listenFindSupplierList(
      (supplierList: SupplierDecoded[]) => this.supplierList = supplierList,
    );

    this.supplierService.emitFindSupplierList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  handleCreateClick() {
    this.navCtrl.navigateForward('/home/modules/sales/suppliers/create');
  }

  handleUpdateClick(payload: SupplierDecoded) {
    this.navCtrl.navigateForward(`/home/modules/sales/suppliers/update/${payload.id}`);
  }

  public async handleActionSheetClick(payload: SupplierDecoded) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () =>
        this.supplierService.deleteSupplier(payload.id)
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

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Suppliers Operations', buttons });
    await actionSheet.present();
  }

  handleDeleteSuccess = async () => {
    const message = 'Supplier was successfully deleted!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
    this.supplierService.emitFindSupplierList();
  };

  handleDeleteError = async () => {
    const message = 'Could not delete this supplier!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };
}
