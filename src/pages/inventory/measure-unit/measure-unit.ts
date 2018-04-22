import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { MeasureUnitFormMode, MeasureUnitFormPage } from './measure-unit-form/measure-unit-form';
import { MeasureUnitRead, MeasureUnitWrite } from '../../../models/measure-unit';
import { MeasureUnitService } from '../../../services/inventory/measure-unit';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-measure-unit',
  templateUrl: 'measure-unit.html'
})
export class MeasureUnitPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  measureUnitList: MeasureUnitRead[];

  constructor(private measureUnitService: MeasureUnitService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.measureUnitService.measureUnitListener
      .subscribe((measureUnitList: MeasureUnitRead[]) => {
        this.measureUnitList = measureUnitList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.measureUnitService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onMeasureUnitCreate() {
    this.navCtrl.push(MeasureUnitFormPage, {mode: MeasureUnitFormMode.Create});
  }

  onMeasureUnitDeleteSuccess = () => {
    this.measureUnitService.sendEventToListener();
    this.presentationUtil.createToast('Measure unit was successfully deleted!');
  };

  onMeasureUnitDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this measure unit!');
  };

  onMeasureUnitActionSheet(payload: MeasureUnitRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.measureUnitService
          .deleteMeasureUnit(payload.id)
          .subscribe(this.onMeasureUnitDeleteSuccess, this.onMeasureUnitDeleteError);
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
    this.actionSheetCtrl.create({title: 'Measure Unit Operations', buttons}).present();
  }

  onNavigateToForm(payload: MeasureUnitRead) {
    this.navCtrl.push(MeasureUnitFormPage, {
      measureUnit: MeasureUnitWrite.createMeasureUnit(payload),
      mode: MeasureUnitFormMode.Update
    });
  }
}
