import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MeasureUnitService } from 'src/services/inventory/measure-unit';

import { MeasureUnitPage } from './measure-unit.page';
import { MeasureUnitFormPage } from './measure-unit-form/measure-unit-form.page';
import { MeasureUnitRoutingModule } from './measure-unit-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MeasureUnitRoutingModule,
  ],
  declarations: [
    MeasureUnitPage,
    MeasureUnitFormPage,
  ],
  providers: [
    MeasureUnitService,
  ]
})
export class MeasureUnitModule { }
