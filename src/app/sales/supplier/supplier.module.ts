import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SupplierService } from 'src/services/sales/supplier';

import { SupplierPage } from './supplier.page';
import { SupplierFormPage } from './supplier-form/supplier-form.page';
import { SupplierRoutingModule } from './supplier-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SupplierRoutingModule,
  ],
  declarations: [
    SupplierPage,
    SupplierFormPage,
  ],
  providers: [
    SupplierService,
  ]
})
export class SupplierModule { }
