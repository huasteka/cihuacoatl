import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController, ToastController, ToastOptions } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { MeasureUnitFormMode, MeasureUnitFormPage } from './measure-unit-form/measure-unit-form';
import { MeasureUnitRead, MeasureUnitWrite } from '../../../models/measure-unit';
import { MeasureUnitService } from '../../../services/measure-unit';

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
              private toastCtrl: ToastController) {
    this.subscription = this.measureUnitService.measureUnitListener
      .subscribe((measureUnitList: MeasureUnitRead[]) => {
        this.measureUnitList = measureUnitList;
      });
  }

  ngOnInit(): void {
    this.measureUnitService.findMeasureUnits();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onMeasureUnitCreate() {
    this.navCtrl.push(MeasureUnitFormPage, {mode: MeasureUnitFormMode.Create});
  }

  onMeasureUnitDeleteSuccess = () => {
    this.createToast('Measure unit was successfully deleted!');
    this.measureUnitService.findMeasureUnits();
  };

  onMeasureUnitDeleteError = () => {
    this.createToast('Could not delete this measure unit!');
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
      handler: () => {
        this.navCtrl.push(MeasureUnitFormPage, {
          measureUnit: MeasureUnitWrite.createMeasureUnit(payload),
          mode: MeasureUnitFormMode.Update
        })
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];
    this.actionSheetCtrl.create({title: 'Measure Unit Operations', buttons}).present();
  }

  private createToast(message: string) {
    const config: ToastOptions = {
      message,
      duration: 2500
    };
    this.toastCtrl.create(config).present();
  }

}
