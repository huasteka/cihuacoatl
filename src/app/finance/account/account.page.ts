import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AccountRead } from 'src/models/finance/account';
import { AccountService } from 'src/services/finance/account';

@Component({
  selector: 'app-page-account',
  templateUrl: 'account.page.html'
})
export class AccountPage implements OnInit, OnDestroy {
  public accountList: AccountRead[];

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private accountService: AccountService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.accountService.listenFindAccountList(
      (accountList: AccountRead[]) => this.accountList = accountList
    );

    this.accountService.emitFindAccountList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleUpdateClick(payload: AccountRead) {
    this.navigationCtrl.navigateForward(`/home/modules/finance/accounts/update/${payload.id}`);
  }

  public async handleActionSheetClick(payload: AccountRead) {
    const deleteHandler = () => this.accountService.deleteAccount(payload.id)
      .toPromise()
      .then(this.handleDeleteSuccess)
      .catch(this.handleDeleteError);

    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: deleteHandler,
    }, {
      text: 'Update',
      icon: 'pencil-outline',
      handler: () => this.handleUpdateClick(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Account Operations', buttons });
    await actionSheet.present();
  }

  private async buildToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }

  private handleDeleteSuccess = async () => {
    await this.buildToast('The account was successfully deleted!');
    this.accountService.emitFindAccountList();
  };

  private handleDeleteError = async () => {
    await this.buildToast('Could not delete this account!');
  };
}
