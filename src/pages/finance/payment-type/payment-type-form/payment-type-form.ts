import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { PaymentTypeWrite } from '../../../../models/payment-type';
import { PaymentTypeService } from '../../../../services/finance/payment-type';
import { PresentationUtil } from '../../../../utils/presentation';

export enum PaymentTypeFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-payment-type-form',
  templateUrl: 'payment-type-form.html'
})
export class PaymentTypeFormPage implements OnInit {
  mode: string = PaymentTypeFormMode.Create;
  paymentType: PaymentTypeWrite;
  paymentTypeForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private paymentTypeService: PaymentTypeService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.paymentType = this.navParams.get('payment-type');
    }
    this.createForm();
  }

  onSubmit() {
    const {code, name} = this.paymentTypeForm.value;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating payment type...');
      this.paymentTypeService
        .updatePaymentType(this.paymentType.id, code, name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'Successfully updated the payment type!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating payment type...');
      this.paymentTypeService
        .createPaymentType(code, name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'A payment type was successfully created!',
          loading
        ));
    }
  }

  private onFinishMeasureUnitOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.paymentTypeService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let code = '';
    let name = '';
    if (this.isUpdate()) {
      ({code, name} = this.paymentType);
    }
    this.paymentTypeForm = new FormGroup({
      code: new FormControl(code, Validators.required),
      name: new FormControl(name, Validators.required)
    });
  }

  private isUpdate(): boolean {
    return this.mode === PaymentTypeFormMode.Update;
  }
}
