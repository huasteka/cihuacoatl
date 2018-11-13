import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { AccountRead, AccountWrite } from '../../../../models/account';
import { PaymentTypeWrite } from '../../../../models/payment-type';
import { AccountService } from '../../../../services/finance/account';
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
  accountList: {[id: number]: AccountRead};

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private paymentTypeService: PaymentTypeService,
              accountService: AccountService) {
    accountService.findAccounts()
      .subscribe((accountList: AccountRead[]) => {
        this.accountList = {};
        accountList.map((account) => {
          this.accountList[account.id] = account;
        });
      });
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.paymentType = this.navParams.get('paymentType');
    }
    this.createForm();
  }

  onSubmit() {
    const {name, terms, accountId} = this.paymentTypeForm.value;
    const shouldSaveTerms = terms.stagedPayment ? terms : null;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating payment type...');
      this.paymentTypeService
        .updatePaymentType(this.paymentType.id, name, this.getAccount(accountId), shouldSaveTerms)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'Successfully updated the payment type!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating payment type...');
      this.paymentTypeService
        .createPaymentType(name, this.getAccount(accountId), shouldSaveTerms)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'A payment type was successfully created!',
          loading
        ));
    }
  }

  getAccountKeys() {
    return Object.keys(this.accountList || {});
  }

  getAccount(accountId: number): AccountWrite {
    return this.accountList[accountId].attributes;
  }

  private onFinishMeasureUnitOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.paymentTypeService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let name = '';
    let paymentAccount = null;
    let terms = null;
    if (this.isUpdate()) {
      ({name, paymentAccount, terms} = this.paymentType);
    }
    this.paymentTypeForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      accountId: new FormControl(
        paymentAccount ? paymentAccount.id : '',
        Validators.required
      ),
      terms: new FormGroup({
        stagedPayment: new FormControl(terms ? terms.stagedPayment : false),
        tax: new FormControl(terms ? terms.tax : ''),
        installmentQuantity: new FormControl(terms ? terms.installmentQuantity : ''),
        firstInstallmentTerm: new FormControl(terms ? terms.firstInstallmentTerm : ''),
        installmentTerm: new FormControl(terms ? terms.installmentTerm : '')
      })
    });
  }

  private isUpdate(): boolean {
    return this.mode === PaymentTypeFormMode.Update;
  }
}
