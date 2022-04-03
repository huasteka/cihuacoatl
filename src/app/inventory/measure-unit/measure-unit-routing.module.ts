import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MeasureUnitPage } from './measure-unit.page';
import { MeasureUnitFormPage, MeasureUnitFormMode } from './measure-unit-form/measure-unit-form.page';

const routes: Routes = [
  {
    path: '',
    component: MeasureUnitPage,
  },
  {
    path: 'create',
    component: MeasureUnitFormPage,
    data: { formMode: MeasureUnitFormMode.create },
  },
  {
    path: 'update/:measureUnitId',
    component: MeasureUnitFormPage,
    data: { formMode: MeasureUnitFormMode.update },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasureUnitRoutingModule { }
