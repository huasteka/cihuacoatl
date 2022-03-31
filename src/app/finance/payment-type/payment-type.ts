import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { PaymentTypeFormMode, PaymentTypeFormPage } from './payment-type-form/payment-type-form';
import { PaymentTypeRead, PaymentTypeWrite } from '../../../models/finance/payment-type';
import { PaymentTypeService } from '../../../services/finance/payment-type';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-payment-type',
  templateUrl: 'payment-type.html'
})
export class PaymentTypePage implements OnInit, OnDestroy {
  private subscription: Subscription;
  paymentTypeList: PaymentTypeRead[];

  constructor(private paymentTypeService: PaymentTypeService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.paymentTypeService
      .paymentTypeListListener
      .subscribe((paymentTypeList: PaymentTypeRead[]) => {
        this.paymentTypeList = paymentTypeList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.paymentTypeService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPaymentTypeCreate() {
    this.navCtrl.push(PaymentTypeFormPage, {mode: PaymentTypeFormMode.Create});
  }

  onPaymentTypeDeleteSuccess = () => {
    this.paymentTypeService.sendEventToListener();
    this.presentationUtil.createToast('The payment type was successfully deleted!');
  };

  onPaymentTypeDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this payment type!');
  };

  onPaymentTypeActionSheet(payload: PaymentTypeRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.paymentTypeService
          .deletePaymentType(payload.id)
          .subscribe(this.onPaymentTypeDeleteSuccess, this.onPaymentTypeDeleteError);
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
    this.actionSheetCtrl.create({title: 'Payment Type Operations', buttons}).present();
  }

  onNavigateToForm(payload: PaymentTypeRead) {
    this.navCtrl.push(PaymentTypeFormPage, {
      paymentType: PaymentTypeWrite.createPaymentType(payload),
      mode: PaymentTypeFormMode.Update
    });
  }
}
