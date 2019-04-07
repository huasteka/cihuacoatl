import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NavController } from "ionic-angular";

import { AccountRead } from "../../../../models/account";
import { PaymentTypeRead } from "../../../../models/payment-type";
import { BudgetCategoryRead } from "../../../../models/budget-category";
import { EntryWrite, EntryType } from "../../../../models/entry";
import { AccountService } from "../../../../services/finance/account";
import { PaymentTypeService } from "../../../../services/finance/payment-type";
import { BudgetCategoryService } from "../../../../services/finance/budget-category";
import { EntryService } from "../../../../services/finance/entry";
import { PresentationUtil } from "../../../../utils/presentation";

export enum EntryFormMode {
  Deposit = 'DEPOSIT',
  Withdraw = 'WITHDRAW'
}

@Component({
  selector: 'page-operation',
  templateUrl: 'operation.html'
})
export class OperationPage implements OnInit {
  entryForm: FormGroup;
  accountList: { [accountId: number]: AccountRead };
  paymentTypeList: { [paymentId: number]: PaymentTypeRead };
  budgetCategoryList: { [budgetId: number]: BudgetCategoryRead };

  constructor(private navCtrl: NavController,
              private presentationUtil: PresentationUtil,
              private entryService: EntryService,
              private accountService: AccountService,
              private paymentTypeService: PaymentTypeService,
              private budgetCategoryService: BudgetCategoryService) {
    this.accountService.findAccounts()
      .subscribe((accountList: AccountRead[]) => {
        this.accountList = {};
        accountList.map((account) => this.accountList[account.id] = account);
      });

    this.paymentTypeService.findPaymentTypes()
      .subscribe((paymentTypeList: PaymentTypeRead[]) => {
        this.paymentTypeList = {};
        paymentTypeList.map((payment) => this.paymentTypeList[payment.id] = payment);
      });

    this.budgetCategoryService.findBudgetCategories()
      .subscribe((budgetCategoryList: BudgetCategoryRead[]) => {
        this.budgetCategoryList = {};
        budgetCategoryList.map((budget) => this.budgetCategoryList[budget.id] = budget);
      });
  }

  ngOnInit() {
    this.createForm();
  }

  getHashMapKeys(hashMap: any) {
    return Object.keys(hashMap || {});
  }

  getHashMapObject(key: number, hashMap: any) {
    return hashMap[key].attributes;
  }

  onSubmit() {
    const {
      type,
      code,
      grossValue,
      description,
      accountId,
      paymentTypeId,
      categoryId
    } = this.entryForm.value;
    const entry = new EntryWrite(
      type, 
      code, 
      grossValue, 
      description, 
      this.accountList[accountId].attributes, 
      this.paymentTypeList[paymentTypeId].attributes, 
      this.budgetCategoryList[categoryId].attributes
    );
    let promise = null;
    if (EntryType.DEPOSIT === type) {
      promise = this.entryService.deposit(entry);
    } else {
      promise = this.entryService.withdraw(entry);
    }
    const loading = this.presentationUtil.createLoading('Updating budget category...');
    promise.subscribe(() => {
      loading.dismiss();
      this.presentationUtil.createToast('An entry has been created!');
      this.entryService.sendEventToListener(accountId);
      this.navCtrl.pop();
    });
  }

  private createForm() {
    this.entryForm = new FormGroup({
      type: new FormControl(EntryType.DEPOSIT, Validators.required),
      code: new FormControl('', Validators.required),
      grossValue: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      accountId: new FormControl('', Validators.required),
      paymentTypeId: new FormControl('', Validators.required),
      categoryId: new FormControl('')
    });
  }
}
