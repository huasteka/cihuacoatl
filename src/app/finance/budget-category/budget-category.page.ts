import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BudgetCategoryRead } from 'src/models/finance/budget-category';
import { BudgetCategoryService } from 'src/services/finance/budget-category';

@Component({
  selector: 'app-page-budget-category',
  templateUrl: 'budget-category.page.html'
})
export class BudgetCategoryPage implements OnInit, OnDestroy {
  public budgetCategoryList: BudgetCategoryRead[];

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private budgetCategoryService: BudgetCategoryService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.budgetCategoryService.listenFindBudgetCategoryList(
      (budgetCategoryList: BudgetCategoryRead[]) => this.budgetCategoryList = budgetCategoryList
    );

    this.budgetCategoryService.emitFindBudgetCategoryList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleCreateClick(): void {
    this.navigationCtrl.navigateForward('/home/modules/finance/budget-categories/create');
  }

  public handleUpdateClick(budgetCategory: BudgetCategoryRead): void {
    const targetUrl = `/home/modules/finance/budget-categories/update/${budgetCategory.id}`;
    this.navigationCtrl.navigateForward(targetUrl);
  }

  public async handleActionSheetClick(payload: BudgetCategoryRead): Promise<void> {
    const deleteHandler = () => this.budgetCategoryService
      .deleteBudgetCategory(payload.id)
      .toPromise()
      .then(this.handleDeleteSuccess)
      .catch(this.handleDeleteError);

    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: deleteHandler
    }, {
      text: 'Update',
      icon: 'pencil-outline',
      handler: () => this.handleUpdateClick(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Budget Category Operations', buttons });
    await actionSheet.present();
  }

  private async buildToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }

  private handleDeleteSuccess = async () => {
    await this.buildToast('The budget category was successfully deleted!');
    this.budgetCategoryService.emitFindBudgetCategoryList();
    this.navigationCtrl.navigateBack('/home/modules/finance/budget-categories');
  };

  private handleDeleteError = async () => {
    await this.buildToast('Could not delete this budget category!');
  };

}
