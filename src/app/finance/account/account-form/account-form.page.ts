import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { AccountRead, AccountWrite } from 'src/models/finance/account';
import { AccountService } from 'src/services/finance/account';

export enum AccountFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-account-form',
  templateUrl: 'account-form.page.html',
  styleUrls: ['account-form.page.scss'],
})
export class AccountFormPage implements OnInit {
  public formMode: string = AccountFormMode.create;
  public accountForm: FormGroup;

  private accountId: number;

  constructor(
    private route: ActivatedRoute,
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.formMode = this.route.snapshot.data.formMode;

    if (this.isUpdate()) {
      this.buildUpdateForm();
      return;
    }

    this.buildForm();
  }

  public async handleSubmit(): Promise<void> {
    const { code, name } = this.accountForm.value;

    if (this.isUpdate()) {
      this.handleUpdate(name, code);
      return;
    }

    this.handleCreate(name, code);
  }

  private buildForm(account?: AccountWrite) {
    const { name = '', code = '' } = account || {};
    this.accountForm = new FormGroup({
      code: new FormControl(code, Validators.required),
      name: new FormControl(name, Validators.required)
    });
  }

  private buildUpdateForm() {
    this.accountId = parseInt(this.route.snapshot.params.accountId, 10);
    this.accountService.findAccountById(this.accountId).subscribe(
      (account: AccountRead) => this.buildForm(
        AccountWrite.createAccount(account)
      )
    );
  }

  private async handleCreate(name: string, code: string): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Creating account...' });
    await loading.present();

    this.accountService
      .createAccount(code, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          this.handleSubscribe('An account was successfully created!');
        },
        async () => {
          await loading.dismiss();
          this.buildToast('The account could not be created!');
        }
      );
  }

  private async handleUpdate(name: string, code: string): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Updating account...' });
    await loading.present();

    this.accountService
      .updateAccount(this.accountId, code, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          this.handleSubscribe('Successfully updated the account!');
        },
        async () => {
          await loading.dismiss();
          this.buildToast('The account could not be updated!');
        }
      );
  }

  private async handleSubscribe(message: string): Promise<void> {
    await this.buildToast(message);
    this.accountService.emitFindAccountList();
    this.navigationCtrl.navigateBack('/home/modules/finance/accounts');
  }

  private async buildToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }

  private isUpdate(): boolean {
    return this.formMode === AccountFormMode.update;
  }
}
