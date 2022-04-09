import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProductService } from 'src/services/sales/product';

import { ProductPage } from './product.page';
import { ProductFormPage } from './product-form/product-form.page';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductRoutingModule,
  ],
  declarations: [
    ProductPage,
    ProductFormPage,
  ],
  providers: [
    ProductService,
  ]
})
export class ProductModule { }
