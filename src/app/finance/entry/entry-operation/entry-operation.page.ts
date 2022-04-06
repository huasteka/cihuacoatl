import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

import { AccountRead } from 'src/models/finance/account';
import { BudgetCategoryRead } from 'src/models/finance/budget-category';
import { EntryWrite, EntryType, EntryRead } from 'src/models/finance/entry';
import { PaymentTypeRead } from 'src/models/finance/payment-type';
import { AccountService } from 'src/services/finance/account';
import { BudgetCategoryService } from 'src/services/finance/budget-category';
import { EntryService } from 'src/services/finance/entry';
import { PaymentTypeService } from 'src/services/finance/payment-type';

@Component({
  selector: 'app-page-operation',
  templateUrl: 'entry-operation.page.html',
  styleUrls: ['entry-operation.page.scss'],
})
export class EntryOperationPage implements OnInit, OnDestroy {
  public entryForm: FormGroup;
  public accountList: AccountRead[];
  public budgetCategoryList: BudgetCategoryRead[];
  public paymentTypeList: PaymentTypeRead[];

  private entryType: EntryType;
  private accountSubscription$: Subscription;
  private budgetCategorySubscription$: Subscription;
  private paymentTypeSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private accountService: AccountService,
    private budgetCategoryService: BudgetCategoryService,
    private entryService: EntryService,
    private paymentTypeService: PaymentTypeService
  ) { }

  public ngOnInit(): void {
    this.entryType = this.route.snapshot.data.entryType;

    this.accountSubscription$ = this.accountService.listenFindAccountList(
      (accountList: AccountRead[]) => this.accountList = accountList
    );

    this.budgetCategorySubscription$ = this.paymentTypeService.listenFindPaymentTypeList(
      (paymentTypeList: PaymentTypeRead[]) => this.paymentTypeList = paymentTypeList
    );

    this.paymentTypeSubscription$ = this.budgetCategoryService.listenFindBudgetCategoryList(
      (budgetCategoryList: BudgetCategoryRead[]) => this.budgetCategoryList = budgetCategoryList
    );

    this.accountService.emitFindAccountList();
    this.budgetCategoryService.emitFindBudgetCategoryList();
    this.paymentTypeService.emitFindPaymentTypeList();

    this.createForm();
  }

  public ngOnDestroy(): void {
    this.accountSubscription$.unsubscribe();
    this.budgetCategorySubscription$.unsubscribe();
    this.paymentTypeSubscription$.unsubscribe();
  }

  public calculateNetValue(): void {
    const { grossValue = 0, addition = 0, discount = 0 } = this.entryForm.value;
    this.entryForm.get('netValue').setValue(grossValue + addition - discount);
  }

  public calculateMaxDiscount(): number {
    const { grossValue = 0, addition = 0 } = this.entryForm.value;
    return grossValue + addition;
  }

  public handlePaymentSelect($event: Event): void {
    const paymentTypeId = ($event as CustomEvent).detail.value;
    const payment = this.paymentTypeList.find((p) => p.id === paymentTypeId);
    if (payment !== null) {
      this.entryForm.get('accountId').setValue(payment.attributes.paymentAccount.id);
    }
  }

  public async handleSubmit(): Promise<void> {
    const entry = this.buildEntry();

    let observable: Observable<EntryRead> = null;
    if (this.isDeposit()) {
      observable = this.entryService.deposit(entry);
    } else {
      observable = this.entryService.withdraw(entry);
    }

    const loading = await this.loadingCtrl.create({ message: 'Creating the entry...' });
    await loading.present();

    observable.subscribe(
      async () => {
        await loading.dismiss();
        this.buildToast('An entry has been created!');
        this.entryService.emitFindEntryList(entry.account.id);
        this.navCtrl.navigateBack('/home/operations/account', {
          queryParams: { accountId: entry.account.id }
        });
      },
      async () => {
        await loading.dismiss();
        this.buildToast('Could not create the entry!');
      }
    );
  }

  public isDeposit() {
    return this.entryType === EntryType.accountDeposit;
  }

  private buildEntry(): EntryWrite {
    const {
      type,
      code,
      grossValue,
      addition = 0,
      discount = 0,
      netValue = 0,
      description = '',
      accountId,
      categoryId,
      paymentTypeId,
    } = this.entryForm.value;

    const account = { id: accountId };
    const category = { id: categoryId };
    const payment = { id: paymentTypeId };

    const entry = new EntryWrite(type, code, grossValue, account, category, payment);
    entry.addition = addition;
    entry.discount = discount;
    entry.netValue = netValue;
    entry.description = description;

    return entry;
  }

  private async buildToast(message: string): Promise<void> {
    const toastConfig = { message, duration: 3000, keyboardClose: true };
    const toast = await this.toastCtrl.create({ ...toastConfig, position: 'top' });
    await toast.present();
  }

  private createForm() {
    this.entryForm = new FormGroup({
      type: new FormControl(this.entryType, Validators.required),
      code: new FormControl('', Validators.required),
      grossValue: new FormControl(0, Validators.required),
      addition: new FormControl(0, Validators.nullValidator),
      discount: new FormControl(0, Validators.nullValidator),
      netValue: new FormControl(0, Validators.nullValidator),
      description: new FormControl('', Validators.required),
      accountId: new FormControl(null, Validators.required),
      categoryId: new FormControl(null),
      paymentTypeId: new FormControl(null, Validators.required),
    });
  }
}
