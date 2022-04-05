import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BudgetGroupRead } from 'src/models/finance/budget-group';
import { BudgetGroupService } from 'src/services/finance/budget-group';

@Component({
  selector: 'app-page-budget-group',
  templateUrl: 'budget-group.page.html',
})
export class BudgetGroupPage implements OnInit, OnDestroy {
  public budgetGroupList: BudgetGroupRead[] = [];

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private budgetGroupService: BudgetGroupService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.budgetGroupService.listenFindBudgetGroupList(
      (budgetGroupList: BudgetGroupRead[]) => this.budgetGroupList = budgetGroupList
    );

    this.budgetGroupService.emitFindBudgetGroupList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleUpdateClick(payload: BudgetGroupRead) {
    this.navigationCtrl.navigateForward(`/home/modules/finance/budget-groups/update/${payload.id}`);
  }

  public async handleActionSheetClick(payload: BudgetGroupRead) {
    const deleteHandler = () => this.budgetGroupService.deleteBudgetGroup(payload.id)
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

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Budget Group Operations', buttons });
    await actionSheet.present();
  }

  private handleDeleteSuccess = async () => {
    const message = 'The budget group was successfully deleted!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
    this.budgetGroupService.emitFindBudgetGroupList();
  };

  private handleDeleteError = async () => {
    const message = 'Could not delete this budget group!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };

}
