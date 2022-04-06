import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AccountRead } from 'src/models/finance/account';
import {
  paymentTermFrequency,
  PaymentTermsWrite,
  PaymentTypeRead,
  PaymentTypeWrite
} from 'src/models/finance/payment-type';
import { AccountService } from 'src/services/finance/account';
import { PaymentTypeService } from 'src/services/finance/payment-type';

export enum PaymentTypeFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-payment-type-form',
  templateUrl: 'payment-type-form.page.html',
  styleUrls: ['payment-type-form.page.scss'],
})
export class PaymentTypeFormPage implements OnInit, OnDestroy {
  public formMode: string;
  public accountList: AccountRead[];
  public paymentTypeForm: FormGroup;
  public paymentTermFrequency = paymentTermFrequency;

  private paymentTypeId: number;
  private accountSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private navigationCtrl: NavController,
    private toastCtrl: ToastController,
    private accountService: AccountService,
    private paymentTypeService: PaymentTypeService
  ) { }

  public ngOnInit(): void {
    this.formMode = this.route.snapshot.data.formMode;

    if (this.isUpdate()) {
      this.buildUpdateForm();
    }
    this.buildForm();
  }

  public ngOnDestroy(): void {
    this.accountSubscription$?.unsubscribe();
  }

  public async handleSubmit(): Promise<void> {
    const { accountId, name, terms = null } = this.paymentTypeForm.value;

    if (this.isUpdate()) {
      this.handleUpdate(accountId, name, terms);
      return;
    }

    this.handleCreate(accountId, name, terms);
  }

  private async handleCreate(accountId: number, name: string, terms?: PaymentTermsWrite) {
    const loading = await this.loadingCtrl.create({ message: 'Creating payment type...' });
    await loading.present();

    this.paymentTypeService
      .createPaymentType(accountId, name, terms)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('A payment type was successfully created!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not create the payment type!');
        }
      );
  }

  private async handleUpdate(accountId: number, name: string, terms?: PaymentTermsWrite) {
    const loading = await this.loadingCtrl.create({ message: 'Updating payment type...' });
    await loading.present();

    this.paymentTypeService
      .updatePaymentType(this.paymentTypeId, accountId, name, terms)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('Successfully updated the payment type!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not update the payment type!');
        }
      );
  }

  private buildForm(account?: PaymentTypeWrite) {
    this.loadAccountList();

    const {
      name = '',
      paymentAccount = null,
      terms = null
    } = account || {};

    const {
      stagedPayment = false,
      tax = 0,
      installmentQuantity = null,
      firstInstallmentTerm = null,
      installmentTerm = null
    } = terms || {};

    this.paymentTypeForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      accountId: new FormControl(paymentAccount ? paymentAccount.id : '', Validators.required),
      terms: new FormGroup({
        stagedPayment: new FormControl(stagedPayment),
        tax: new FormControl(tax),
        installmentQuantity: new FormControl(installmentQuantity),
        firstInstallmentTerm: new FormControl(firstInstallmentTerm),
        installmentTerm: new FormControl(installmentTerm)
      })
    });
  }

  private loadAccountList(): void {
    this.accountSubscription$ = this.accountService.listenFindAccountList(
      (accountList: AccountRead[]) => this.accountList = accountList,
    );

    this.accountService.emitFindAccountList();
  }

  private buildUpdateForm(): void {
    this.paymentTypeId = this.route.snapshot.params.paymentTypeId;

    this.paymentTypeService.findPaymentTypeById(this.paymentTypeId).subscribe(
      (paymentType: PaymentTypeRead) => this.buildForm(
        PaymentTypeWrite.createPaymentType(paymentType)
      ),
    );
  }

  private async handleSubscribe(message: string): Promise<void> {
    await this.buildToast(message);
    this.paymentTypeService.emitFindPaymentTypeList();
    this.navigationCtrl.navigateBack('/home/modules/finance/payment-types');
  }

  private async buildToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }

  private isUpdate(): boolean {
    return this.formMode === PaymentTypeFormMode.update;
  }
}
