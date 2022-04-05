import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { BudgetGroupRead, BudgetGroupWrite } from 'src/models/finance/budget-group';
import { BudgetGroupService } from 'src/services/finance/budget-group';

export enum BudgetGroupFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-budget-group-form',
  templateUrl: 'budget-group-form.page.html',
  styleUrls: ['budget-group-form.page.scss'],
})
export class BudgetGroupFormPage implements OnInit {
  public formMode: string;
  public budgetGroupForm: FormGroup;

  private budgetGroupId: number;

  constructor(
    private route: ActivatedRoute,
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private budgetGroupService: BudgetGroupService
  ) { }

  public ngOnInit(): void {
    this.formMode = this.route.snapshot.data.formMode;

    if (this.isUpdate()) {
      this.buildUpdateForm();
      return;
    }

    this.buildForm();
  }

  public async handleSubmit(): Promise<void> {
    const { name } = this.budgetGroupForm.value;

    if (this.isUpdate()) {
      this.handleUpdate(name);
    } else {
      this.handleCreate(name);
    }
  }

  private async handleCreate(name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Creating budget group...' });
    await loading.present();

    this.budgetGroupService
      .createBudgetGroup(name)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('A budget group was successfully created!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not create the budget group!');
        },
      );
  }

  private async handleUpdate(name: string) {
    const loading = await this.loadingCtrl.create({ message: 'Updating budget group...' });
    await loading.present();

    this.budgetGroupService
      .updateBudgetGroup(this.budgetGroupId, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('Successfully updated the budget group!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not update the budget group!');
        },
      );
  }

  private async buildToast(message: string): Promise<void> {
    const toastConfig = { message, duration: 3000, keyboardClose: true };
    const toast = await this.toastCtrl.create({ ...toastConfig, position: 'top' });
    await toast.present();
  }

  private async handleSubscribe(message: string) {
    await this.buildToast(message);

    this.budgetGroupService.emitFindBudgetGroupList();
    this.navigationCtrl.navigateBack('/home/modules/finance/budget-groups');
  }

  private buildForm(budgetGroup?: BudgetGroupWrite) {
    const { name = '' } = budgetGroup || {};

    this.budgetGroupForm = new FormGroup({
      name: new FormControl(name, Validators.required)
    });
  }

  private buildUpdateForm() {
    this.budgetGroupId = parseInt(this.route.snapshot.params?.budgetGroupId, 10);

    this.budgetGroupService.findBudgetGroupById(this.budgetGroupId).subscribe(
      (budgetGroup: BudgetGroupRead) => this.buildForm(
        BudgetGroupWrite.createBudgetGroup(budgetGroup)
      )
    );
  }

  private isUpdate(): boolean {
    return this.formMode === BudgetGroupFormMode.update;
  }
}
