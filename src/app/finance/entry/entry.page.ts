import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AccountRead } from 'src/models/finance/account';
import { EntryRead, EntryWrite, EntryType } from 'src/models/finance/entry';
import { AccountService } from 'src/services/finance/account';
import { EntryService } from 'src/services/finance/entry';

@Component({
  selector: 'app-page-entry',
  templateUrl: 'entry.page.html',
  styleUrls: ['entry.page.scss'],
})
export class EntryPage implements OnInit, OnDestroy {
  public selectedAccountId: number;
  public accountList: AccountRead[];
  public entryList: EntryRead[];

  private accountSubscription$: Subscription;
  private entrySubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private currencyPipe: CurrencyPipe,
    private accountService: AccountService,
    private entryService: EntryService
  ) { }

  public ionViewWillEnter() {
    const selectedAccountId = this.route.snapshot.queryParams?.accountId;
    if (selectedAccountId) {
      this.selectedAccountId = selectedAccountId;
    }
  }

  public ngOnInit(): void {
    this.loadAccountList();

    this.entrySubscription$ = this.entryService.listenFindEntryList(
      (entryList: EntryRead[]) => this.entryList = entryList
    );
  }

  public ngOnDestroy(): void {
    this.accountSubscription$?.unsubscribe();
    this.entrySubscription$?.unsubscribe();
  }

  public handleSelectAccountClick($event: Event): void {
    this.selectedAccountId = ($event as CustomEvent).detail.value;
    this.entryService.emitFindEntryList(this.selectedAccountId);
  }

  public handleDepositClick(): void {
    const queryParams = this.selectedAccountId ? { accountId: this.selectedAccountId } : {};
    this.navCtrl.navigateForward(`/home/operations/account/deposit`, { queryParams });
  }

  public handleWithdrawClick(): void {
    const queryParams = this.selectedAccountId ? { accountId: this.selectedAccountId } : {};
    this.navCtrl.navigateForward(`/home/operations/account/withdraw`, { queryParams });
  }

  public handleDetailClick(entry: EntryRead): void {
    this.navCtrl.navigateForward(`/home/operations/account/details/${entry.id}`);
  }

  public getEntryClass({ type }: EntryWrite) {
    return {
      credit: type === EntryType.accountDeposit,
      debit: type === EntryType.accountWithdraw
    };
  }

  public getEntryValue({ type, grossValue }: EntryWrite): string {
    const transformedValue = type === EntryType.accountDeposit ? grossValue : grossValue * -1;
    return this.getCurrency(transformedValue);
  }

  private getCurrency(amount: number): string {
    return this.currencyPipe.transform(amount);
  }

  private loadAccountList() {
    this.accountSubscription$ = this.accountService.listenFindAccountList(
      (accountList: AccountRead[]) => this.accountList = accountList,
    );

    this.accountService.emitFindAccountList();
  }
}
