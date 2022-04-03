import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { MeasureUnitRead } from 'src/models/inventory/measure-unit';
import { MeasureUnitService } from 'src/services/inventory/measure-unit';

@Component({
  selector: 'app-page-measure-unit',
  templateUrl: 'measure-unit.page.html'
})
export class MeasureUnitPage implements OnInit, OnDestroy {
  public measureUnitList: MeasureUnitRead[];

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private measureUnitService: MeasureUnitService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.measureUnitService.listenFindMeasureUnitList(
      (measureUnitList: MeasureUnitRead[]) => this.measureUnitList = measureUnitList,
    );

    this.measureUnitService.emitFindMeasureUnitList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleCreateClick(): void {
    this.navigationCtrl.navigateForward(`/home/modules/inventory/measure-units/create`);
  }

  public handleUpdateClick(payload: MeasureUnitRead): void {
    const targetUrl = `/home/modules/inventory/measure-units/update/${payload.id}`;
    this.navigationCtrl.navigateForward(targetUrl);
  }

  public async handleActionSheetClick(payload: MeasureUnitRead) {
    const deleteHandler = () => this.measureUnitService
      .deleteMeasureUnit(payload.id)
      .toPromise()
      .then(this.handleDeleteSuccess)
      .catch(this.handleDeleteError);

    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: deleteHandler,
    }, {
      text: 'Update',
      icon: 'create',
      handler: () => this.handleUpdateClick(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Measure Unit Operations', buttons });
    await actionSheet.present();
  }

  private handleDeleteSuccess = async () => {
    const message = 'Measure unit was successfully deleted!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
    this.measureUnitService.emitFindMeasureUnitList();
  };

  private handleDeleteError = async () => {
    const message = 'Could not delete this measure unit!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };
}
