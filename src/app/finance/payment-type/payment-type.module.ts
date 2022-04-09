import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AccountService } from 'src/services/finance/account';
import { PaymentTypeService } from 'src/services/finance/payment-type';

import { PaymentTypePage } from './payment-type.page';
import { PaymentTypeFormPage } from './payment-type-form/payment-type-form.page';
import { PaymentTypeRoutingModule } from './payment-type-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PaymentTypeRoutingModule,
  ],
  declarations: [
    PaymentTypePage,
    PaymentTypeFormPage,
  ],
  providers: [
    AccountService,
    PaymentTypeService,
  ]
})
export class PaymentTypeModule { }
