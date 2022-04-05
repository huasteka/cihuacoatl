import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BudgetGroupService } from 'src/services/finance/budget-group';
import { BudgetCategoryService } from 'src/services/finance/budget-category';

import { BudgetCategoryPage } from './budget-category.page';
import { BudgetCategoryFormPage } from './budget-category-form/budget-category-form.page';
import { BudgetCategoryRoutingModule } from './budget-category-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BudgetCategoryRoutingModule,
  ],
  declarations: [
    BudgetCategoryPage,
    BudgetCategoryFormPage,
  ],
  providers: [
    BudgetCategoryService,
    BudgetGroupService,
  ]
})
export class BudgetCategoryModule { }
