import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ItemService } from 'src/services/inventory/item';
import { MeasureUnitService } from 'src/services/inventory/measure-unit';

import { InventoryPageRoutingModule } from './inventory-routing.module';
import { InventoryPage } from './inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryPageRoutingModule,
  ],
  declarations: [
    InventoryPage,
  ],
  providers: [
    MeasureUnitService,
    ItemService,
  ]
})
export class InventoryPageModule { }
