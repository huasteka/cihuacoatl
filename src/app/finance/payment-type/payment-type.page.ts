import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  NavController,
  ToastController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PaymentTypeRead } from 'src/models/finance/payment-type';
import { PaymentTypeService } from 'src/services/finance/payment-type';

@Component({
  selector: 'app-page-payment-type',
  templateUrl: 'payment-type.page.html'
})
export class PaymentTypePage implements OnInit, OnDestroy {
  public paymentTypeList: PaymentTypeRead[];

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private paymentTypeService: PaymentTypeService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.paymentTypeService.listenFindPaymentTypeList(
      (paymentTypeList: PaymentTypeRead[]) => this.paymentTypeList = paymentTypeList
    );

    this.paymentTypeService.emitFindPaymentTypeList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleCreateClick(): void {
    this.navigationCtrl.navigateForward('/home/modules/finance/payment-types/create');
  }

  public handleUpdateClick(paymentType: PaymentTypeRead): void {
    const targetUrl = `/home/modules/finance/payment-types/update/${paymentType.id}`;
    this.navigationCtrl.navigateForward(targetUrl);
  }

  public async handleActionSheetClick(payload: PaymentTypeRead) {
    const deleteHandler = () => this.paymentTypeService.deletePaymentType(payload.id)
      .toPromise()
      .then(this.handleDeleteSuccess)
      .catch(this.handleDeleteError);

    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: deleteHandler
    }, {
      text: 'Update',
      icon: 'pencil-outline',
      handler: () => this.handleUpdateClick(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Payment Type Operations', buttons });
    await actionSheet.present();
  }

  private handleDeleteSuccess = async () => {
    await this.buildToast('The payment type was successfully deleted!');
    this.paymentTypeService.emitFindPaymentTypeList();
    this.navigationCtrl.navigateBack('/home/modules/finance/payment-types');
  };

  private handleDeleteError = async () => {
    await this.buildToast('Could not delete this payment type!');
  };

  private async buildToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }
}
