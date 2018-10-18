import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { BudgetGroupFormMode, BudgetGroupFormPage } from './budget-group-form/budget-group-form';
import { BudgetGroupRead, BudgetGroupWrite } from '../../../models/budget-group';
import { BudgetGroupService } from '../../../services/finance/budget-group';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-budget-group',
  templateUrl: 'budget-group.html'
})
export class BudgetGroupPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  budgetGroupList: BudgetGroupRead[];

  constructor(private budgetGroupService: BudgetGroupService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.budgetGroupService
      .budgetGroupListListener
      .subscribe((budgetGroupList: BudgetGroupRead[]) => {
        this.budgetGroupList = budgetGroupList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.budgetGroupService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onBudgetGroupCreate() {
    this.navCtrl.push(BudgetGroupFormPage, {mode: BudgetGroupFormMode.Create});
  }

  onBudgetGroupDeleteSuccess = () => {
    this.budgetGroupService.sendEventToListener();
    this.presentationUtil.createToast('The budget group was successfully deleted!');
  };

  onBudgetGroupDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this budget group!');
  };

  onBudgetGroupActionSheet(payload: BudgetGroupRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.budgetGroupService
          .deleteBudgetGroup(payload.id)
          .subscribe(this.onBudgetGroupDeleteSuccess, this.onBudgetGroupDeleteError);
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
    this.actionSheetCtrl.create({title: 'Budget Group Operations', buttons}).present();
  }

  onNavigateToForm(payload: BudgetGroupRead) {
    this.navCtrl.push(BudgetGroupFormPage, {
      budgetGroup: BudgetGroupWrite.createBudgetGroup(payload),
      mode: BudgetGroupFormMode.Update
    });
  }
}
