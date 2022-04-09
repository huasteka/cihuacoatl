import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BudgetGroupService } from 'src/services/finance/budget-group';

import { BudgetGroupPage } from './budget-group.page';
import { BudgetGroupFormPage } from './budget-group-form/budget-group-form.page';
import { BudgetGroupRoutingModule } from './budget-group-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BudgetGroupRoutingModule,
  ],
  declarations: [
    BudgetGroupPage,
    BudgetGroupFormPage,
  ],
  providers: [
    BudgetGroupService,
  ]
})
export class BudgetGroupModule { }
