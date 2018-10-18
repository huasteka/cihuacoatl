import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { AccountWrite } from '../../../../models/account';
import { AccountService } from '../../../../services/finance/account';
import { PresentationUtil } from '../../../../utils/presentation';

export enum AccountFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-account-form',
  templateUrl: 'account-form.html'
})
export class AccountFormPage implements OnInit {
  mode: string = AccountFormMode.Create;
  account: AccountWrite;
  accountForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.account = this.navParams.get('account');
    }
    this.createForm();
  }

  onSubmit() {
    const {code, name} = this.accountForm.value;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating account...');
      this.accountService
        .updateAccount(this.account.id, code, name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'Successfully updated the account!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating account...');
      this.accountService
        .createAccount(code, name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'An account was successfully created!',
          loading
        ));
    }
  }

  private onFinishMeasureUnitOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.accountService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let code = '';
    let name = '';
    if (this.isUpdate()) {
      ({code, name} = this.account);
    }
    this.accountForm = new FormGroup({
      code: new FormControl(code, Validators.required),
      name: new FormControl(name, Validators.required)
    });
  }

  private isUpdate(): boolean {
    return this.mode === AccountFormMode.Update;
  }
}
