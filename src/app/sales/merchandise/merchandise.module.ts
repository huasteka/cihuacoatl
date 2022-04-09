import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProductService } from 'src/services/sales/product';
import { MerchandiseService } from 'src/services/sales/merchandise';

import { MerchandisePage } from './merchandise.page';
import { MerchandiseFormPage } from './merchandise-form/merchandise-form.page';
import { MerchandiseRoutingModule } from './merchandise-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MerchandiseRoutingModule,
  ],
  declarations: [
    MerchandisePage,
    MerchandiseFormPage,
  ],
  providers: [
    ProductService,
    MerchandiseService,
  ]
})
export class MerchandiseModule { }
