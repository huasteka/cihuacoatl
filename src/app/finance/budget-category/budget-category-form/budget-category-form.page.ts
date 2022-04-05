import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { BudgetCategoryRead, BudgetCategoryWrite } from 'src/models/finance/budget-category';
import { BudgetGroupRead } from 'src/models/finance/budget-group';
import { BudgetCategoryService } from 'src/services/finance/budget-category';
import { BudgetGroupService } from 'src/services/finance/budget-group';

export enum BudgetCategoryFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-budget-category-form',
  templateUrl: 'budget-category-form.page.html',
  styleUrls: ['budget-category-form.page.scss'],
})
export class BudgetCategoryFormPage implements OnInit {
  public formMode: string;
  public budgetGroupList: BudgetGroupRead[];
  public budgetCategoryForm: FormGroup;

  private budgetCategoryId: number;

  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private navigationCtrl: NavController,
    private toastCtrl: ToastController,
    private budgetCategoryService: BudgetCategoryService,
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
    const { name, budgetGroupId } = this.budgetCategoryForm.value;

    if (this.isUpdate()) {
      await this.handleUpdate(name, budgetGroupId);
      return;
    }

    await this.handleCreate(name, budgetGroupId);
  }

  private buildForm(budgetCategory?: BudgetCategoryWrite): void {
    this.loadBudgetGroupList();

    const { name = '', group = null } = budgetCategory || {};
    this.budgetCategoryForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      budgetGroupId: new FormControl(group ? group.id : null, Validators.required),
    });
  }

  private loadBudgetGroupList(): void {
    this.budgetGroupService.listenFindBudgetGroupList(
      (budgetGroupList: BudgetGroupRead[]) => this.budgetGroupList = budgetGroupList
    );

    this.budgetGroupService.emitFindBudgetGroupList();
  }

  private buildUpdateForm() {
    this.budgetCategoryId = this.route.snapshot.params.budgetCategoryId;

    this.budgetCategoryService.findBudgetCategoryById(this.budgetCategoryId).subscribe(
      (budgetCategory: BudgetCategoryRead) => this.buildForm(
        BudgetCategoryWrite.createBudgetCategory(budgetCategory)
      ),
    );
  }

  private async handleCreate(name: string, budgetGroupId: number) {
    const loading = await this.loadingCtrl.create({ message: 'Creating budget category...' });
    await loading.present();

    this.budgetCategoryService
      .createBudgetCategory(budgetGroupId, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('A budget category was successfully created!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not create the budget category!');
        }
      );
  }

  private async handleUpdate(name: string, budgetGroupId: number) {
    const loading = await this.loadingCtrl.create({ message: 'Updating budget category...' });
    await loading.present();

    this.budgetCategoryService
      .updateBudgetCategory(this.budgetCategoryId, budgetGroupId, name)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('Successfully updated the budget category!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not update the budget category!');
        }
      );
  }

  private async handleSubscribe(message: string): Promise<void> {
    await this.buildToast(message);
    this.budgetCategoryService.emitFindBudgetCategoryList();
    this.navigationCtrl.navigateBack('/home/modules/finance/budget-categories');
  }

  private async buildToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }

  private isUpdate(): boolean {
    return this.formMode === BudgetCategoryFormMode.update;
  }
}
