import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ItemService } from 'src/services/inventory/item';
import { MeasureUnitService } from 'src/services/inventory/measure-unit';
import { StorageService } from 'src/services/inventory/storage';

import { InventoryPageRoutingModule } from './inventory-routing.module';
import { InventoryPage } from './inventory.page';
import { StoragePage } from './storage/storage.page';
import { StorageChildPage } from './storage/storage-child/storage-child.page';
import { StorageFormPage } from './storage/storage-form/storage-form.page';
import { StorageActionSheetService } from './storage/storage-action-sheet.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryPageRoutingModule,
  ],
  declarations: [
    InventoryPage,
    StoragePage,
    StorageChildPage,
    StorageFormPage,
  ],
  providers: [
    StorageService,
    MeasureUnitService,
    ItemService,
    StorageActionSheetService,
  ]
})
export class InventoryPageModule { }
