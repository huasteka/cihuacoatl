import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { AccountFormMode, AccountFormPage } from './account-form/account-form';
import { AccountRead, AccountWrite } from '../../../models/account';
import { AccountService } from '../../../services/finance/account';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  accountList: AccountRead[];

  constructor(private accountService: AccountService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.accountService
      .accountListListener
      .subscribe((accountList: AccountRead[]) => {
        this.accountList = accountList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.accountService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAccountCreate() {
    this.navCtrl.push(AccountFormPage, {mode: AccountFormMode.Create});
  }

  onAccountDeleteSuccess = () => {
    this.accountService.sendEventToListener();
    this.presentationUtil.createToast('The account was successfully deleted!');
  };

  onAccountDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this account!');
  };

  onAccountActionSheet(payload: AccountRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.accountService
          .deleteAccount(payload.id)
          .subscribe(this.onAccountDeleteSuccess, this.onAccountDeleteError);
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
    this.actionSheetCtrl.create({title: 'Account Operations', buttons}).present();
  }

  onNavigateToForm(payload: AccountRead) {
    this.navCtrl.push(AccountFormPage, {
      account: AccountWrite.createAccount(payload),
      mode: AccountFormMode.Update
    });
  }
}
