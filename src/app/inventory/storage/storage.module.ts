import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StorageService } from 'src/services/inventory/storage';

import { StoragePage } from './storage.page';
import { StorageActionSheetService } from './storage-action-sheet.service';
import { StorageRoutingModule } from './storage-routing.module';
import { StorageChildPage } from './storage-child/storage-child.page';
import { StorageFormPage } from './storage-form/storage-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StorageRoutingModule,
  ],
  declarations: [
    StoragePage,
    StorageChildPage,
    StorageFormPage,
  ],
  providers: [
    StorageService,
    StorageActionSheetService,
  ]
})
export class UserModule { }
