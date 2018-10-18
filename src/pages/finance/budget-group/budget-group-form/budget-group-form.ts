import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { BudgetGroupWrite } from '../../../../models/budget-group';
import { BudgetGroupService } from '../../../../services/finance/budget-group';
import { PresentationUtil } from '../../../../utils/presentation';

export enum BudgetGroupFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-budget-group-form',
  templateUrl: 'budget-group-form.html'
})
export class BudgetGroupFormPage implements OnInit {
  mode: string = BudgetGroupFormMode.Create;
  budgetGroup: BudgetGroupWrite;
  budgetGroupForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private budgetGroupService: BudgetGroupService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.budgetGroup = this.navParams.get('budgetGroup');
    }
    this.createForm();
  }

  onSubmit() {
    const {name} = this.budgetGroupForm.value;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating budget group...');
      this.budgetGroupService
        .updateBudgetGroup(this.budgetGroup.id, name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'Successfully updated the budget group!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating budget group...');
      this.budgetGroupService
        .createBudgetGroup(name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'A budget group was successfully created!',
          loading
        ));
    }
  }

  private onFinishMeasureUnitOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.budgetGroupService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let name = '';
    if (this.isUpdate()) {
      ({name} = this.budgetGroup);
    }
    this.budgetGroupForm = new FormGroup({
      name: new FormControl(name, Validators.required)
    });
  }

  private isUpdate(): boolean {
    return this.mode === BudgetGroupFormMode.Update;
  }
}
