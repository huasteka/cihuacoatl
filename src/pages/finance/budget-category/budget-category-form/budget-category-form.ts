import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { BudgetGroupRead, BudgetGroupWrite } from '../../../../models/budget-group';
import { BudgetCategoryWrite } from '../../../../models/budget-category';
import { BudgetGroupService } from '../../../../services/finance/budget-group';
import { BudgetCategoryService } from '../../../../services/finance/budget-category';
import { PresentationUtil } from '../../../../utils/presentation';

export enum BudgetCategoryFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-budget-category-form',
  templateUrl: 'budget-category-form.html'
})
export class BudgetCategoryFormPage implements OnInit {
  mode: string = BudgetCategoryFormMode.Create;
  budgetCategory: BudgetCategoryWrite;
  budgetCategoryForm: FormGroup;
  budgetGroupList: { [groupId: number]: BudgetGroupRead };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private budgetCategoryService: BudgetCategoryService,
              budgetGroupService: BudgetGroupService) {
    budgetGroupService.findBudgetGroups()
      .subscribe((budgetGroupList: BudgetGroupRead[]) => {
        this.budgetGroupList = {};
        budgetGroupList.map((budgetGroup) => {
          this.budgetGroupList[budgetGroup.id] = budgetGroup;
        });
      });
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.budgetCategory = this.navParams.get('budgetCategory');
    }
    this.createForm();
  }

  onSubmit() {
    const {name, budgetGroupId} = this.budgetCategoryForm.value;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating budget category...');
      this.budgetCategoryService
        .updateBudgetCategory(this.budgetCategory.id, name, this.getBudgetGroup(budgetGroupId))
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'Successfully updated the budget category!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating budget category...');
      this.budgetCategoryService
        .createBudgetCategory(name, this.getBudgetGroup(budgetGroupId))
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'A budget category was successfully created!',
          loading
        ));
    }
  }

  getBudgetGroupKeys() {
    return Object.keys(this.budgetGroupList || {});
  }

  getBudgetGroup(budgetGroupId): BudgetGroupWrite {
    return this.budgetGroupList[budgetGroupId].attributes;
  }

  private onFinishMeasureUnitOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.budgetCategoryService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let name = '';
    let group = null;
    if (this.isUpdate()) {
      ({name, group} = this.budgetCategory);
    }
    this.budgetCategoryForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      budgetGroupId: new FormControl(
        group ? group.id : '',
        Validators.required
      )
    });
  }

  private isUpdate(): boolean {
    return this.mode === BudgetCategoryFormMode.Update;
  }
}
