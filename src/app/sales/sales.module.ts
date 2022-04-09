import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SalesPageRoutingModule } from './sales-routing.module';
import { SalesPage } from './sales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SalesPageRoutingModule,
  ],
  declarations: [
    SalesPage,
  ]
})
export class SalesPageModule { }
