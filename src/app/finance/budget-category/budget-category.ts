import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { BudgetCategoryFormMode, BudgetCategoryFormPage } from './budget-category-form/budget-category-form';
import { BudgetCategoryRead, BudgetCategoryWrite } from '../../../models/finance/budget-categorycategory';
import { BudgetCategoryService } from '../../../services/finance/budget-category';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-budget-category',
  templateUrl: 'budget-category.html'
})
export class BudgetCategoryPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  budgetCategoryList: BudgetCategoryRead[];

  constructor(private budgetCategoryService: BudgetCategoryService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.budgetCategoryService
      .budgetCategoryListListener
      .subscribe((budgetCategoryList: BudgetCategoryRead[]) => {
        this.budgetCategoryList = budgetCategoryList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.budgetCategoryService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onBudgetCategoryCreate() {
    this.navCtrl.push(BudgetCategoryFormPage, {mode: BudgetCategoryFormMode.Create});
  }

  onBudgetCategoryDeleteSuccess = () => {
    this.budgetCategoryService.sendEventToListener();
    this.presentationUtil.createToast('The budget category was successfully deleted!');
  };

  onBudgetCategoryDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this budget category!');
  };

  onBudgetCategoryActionSheet(payload: BudgetCategoryRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.budgetCategoryService
          .deleteBudgetCategory(payload.id)
          .subscribe(this.onBudgetCategoryDeleteSuccess, this.onBudgetCategoryDeleteError);
      }
    }, {
      text: 'Update',
      icon: 'create',
      handler: () => this.onNavigateToForm(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];
    this.actionSheetCtrl.create({title: 'Budget Category Operations', buttons}).present();
  }

  onNavigateToForm(payload: BudgetCategoryRead) {
    this.navCtrl.push(BudgetCategoryFormPage, {
      budgetCategory: BudgetCategoryWrite.createBudgetCategory(payload),
      mode: BudgetCategoryFormMode.Update
    });
  }
}
