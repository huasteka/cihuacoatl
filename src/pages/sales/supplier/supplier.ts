import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { SupplierFormMode, SupplierFormPage } from './supplier-form/supplier-form';
import { SupplierRead, SupplierWrite } from '../../../models/supplier';
import { SupplierService } from '../../../services/sales/supplier';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-supplier',
  templateUrl: 'supplier.html'
})
export class SupplierPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  supplierList: SupplierRead[];

  constructor(private supplierService: SupplierService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.supplierService.supplierListener
      .subscribe((supplierList: SupplierRead[]) => {
        this.supplierList = supplierList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.supplierService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSupplierCreate() {
    this.navCtrl.push(SupplierFormPage, {mode: SupplierFormMode.Create});
  }

  onSupplierDeleteSuccess = () => {
    this.supplierService.sendEventToListener();
    this.presentationUtil.createToast('The supplier was successfully deleted!');
  };

  onSupplierDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this supplier!');
  };

  onSupplierActionSheet(payload: SupplierRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.supplierService
          .deleteSupplier(payload.id)
          .subscribe(this.onSupplierDeleteSuccess, this.onSupplierDeleteError);
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
    this.actionSheetCtrl.create({title: 'Supplier Operations', buttons}).present();
  }

  onNavigateToForm(payload: SupplierRead) {
    this.navCtrl.push(SupplierFormPage, {
      supplier: SupplierWrite.createSupplier(payload),
      mode: SupplierFormMode.Update
    });
  }
}
