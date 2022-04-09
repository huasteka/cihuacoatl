import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ClientService } from 'src/services/sales/client';

import { ClientPage } from './client.page';
import { ClientFormPage } from './client-form/client-form.page';
import { ClientRoutingModule } from './client-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClientRoutingModule,
  ],
  declarations: [
    ClientPage,
    ClientFormPage,
  ],
  providers: [
    ClientService,
  ]
})
export class ClientModule { }
