import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AccountService } from 'src/services/finance/account';

import { AccountPage } from './account.page';
import { AccountFormPage } from './account-form/account-form.page';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountRoutingModule,
  ],
  declarations: [
    AccountPage,
    AccountFormPage,
  ],
  providers: [
    AccountService,
  ]
})
export class AccountModule { }
