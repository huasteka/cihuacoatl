import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavController } from "ionic-angular";

import { OperationPage } from "./operation/operation";
import { EntryService } from "../../../services/finance/entry";
import { Subscription } from "rxjs/Subscription";
import { EntryRead, EntryWrite, EntryType } from "../../../models/entry";
import { PresentationUtil } from "../../../utils/presentation";
import { AccountService } from "../../../services/finance/account";
import { AccountRead } from "../../../models/account";
import { EntryDetailPage } from "./entry-detail/entry-detail";

@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage implements OnInit, OnDestroy {
  operationPage = OperationPage;
  private accountSubscription: Subscription;
  private subscription: Subscription;
  accountList: AccountRead[];
  entryList: EntryRead[];
  selectedAccount: number;

  constructor(private navCtrl: NavController,
              private accountService: AccountService,
              private entryService: EntryService,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.accountSubscription = this.accountService
      .accountListListener
      .subscribe((accountList: AccountRead[]) => {
        this.accountList = accountList;
        loading.dismiss();
      });

    this.subscription = this.entryService
      .entryListListener
      .subscribe((entryList: EntryRead[]) => this.entryList = entryList);
  }

  ngOnInit(): void {
    this.accountService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

  onAccountSelect(accountId: number) {
    this.selectedAccount = accountId;
    this.entryService.sendEventToListener(accountId);
  }

  onEntrySelect(entry: EntryWrite) {
    this.navCtrl.push(EntryDetailPage, { entry })
  }

  onEntryCreate() {
    this.navCtrl.push(this.operationPage);
  }

  getEntryValue(entry: EntryWrite) {
    return entry.type === EntryType.DEPOSIT 
      ? entry.grossValue 
      : entry.grossValue * -1;
  }

  getEntryClass(entry: EntryWrite) {
    return {
      credit: entry.type === EntryType.DEPOSIT, 
      debit: entry.type === EntryType.WITHDRAW
    };
  }
}
