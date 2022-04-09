import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ItemService } from 'src/services/inventory/item';
import { MeasureUnitService } from 'src/services/inventory/measure-unit';

import { ItemPage } from './item.page';
import { ItemFormPage } from './item-form/item-form.page';
import { ItemRoutingModule } from './item-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ItemRoutingModule,
  ],
  declarations: [
    ItemPage,
    ItemFormPage,
  ],
  providers: [
    ItemService,
    MeasureUnitService,
  ]
})
export class ItemModule { }
