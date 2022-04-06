import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AccountService } from 'src/services/finance/account';
import { BudgetCategoryService } from 'src/services/finance/budget-category';
import { EntryService } from 'src/services/finance/entry';
import { PaymentTypeService } from 'src/services/finance/payment-type';

import { EntryPage } from './entry.page';
import { EntryDetailPage } from './entry-detail/entry-detail.page';
import { EntryOperationPage } from './entry-operation/entry-operation.page';
import { EntryRoutingModule } from './entry-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EntryRoutingModule,
  ],
  declarations: [
    EntryPage,
    EntryDetailPage,
    EntryOperationPage,
  ],
  providers: [
    AccountService,
    BudgetCategoryService,
    PaymentTypeService,
    EntryService,
  ]
})
export class EntryPageModule { }
