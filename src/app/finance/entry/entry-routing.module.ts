import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntryType } from 'src/models/finance/entry';

import { EntryPage } from './entry.page';
import { EntryDetailPage } from './entry-detail/entry-detail.page';
import { EntryOperationPage } from './entry-operation/entry-operation.page';

const routes: Routes = [
  {
    path: '',
    component: EntryPage,
  },
  {
    path: 'deposit',
    component: EntryOperationPage,
    data: { entryType: EntryType.accountDeposit },
  },
  {
    path: 'withdraw',
    component: EntryOperationPage,
    data: { entryType: EntryType.accountWithdraw },
  },
  {
    path: 'details/:entryId',
    component: EntryDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
