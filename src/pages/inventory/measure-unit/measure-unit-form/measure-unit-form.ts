import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController, ToastOptions } from 'ionic-angular';

import { MeasureUnitWrite } from '../../../../models/measure-unit';
import { MeasureUnitService } from '../../../../services/measure-unit';

export enum MeasureUnitFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-measure-unit-form',
  templateUrl: './measure-unit-form.html'
})
export class MeasureUnitFormPage implements OnInit{
  mode: string = MeasureUnitFormMode.Create;
  measureUnit: MeasureUnitWrite;
  measureUnitForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private measureUnitService: MeasureUnitService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.measureUnit = this.navParams.get('measureUnit');
    }
    this.createForm();
  }

  onSubmit() {
    const {name, acronym} = this.measureUnitForm.value;
    if (this.isUpdate()) {
      this.measureUnitService
        .updateMeasureUnit(this.measureUnit.id, acronym, name)
        .subscribe(() => {
          this.createToast('A measure unit was successfully created!');
          this.measureUnitService.findMeasureUnits();
          this.navCtrl.pop();
        });
    } else {
      this.measureUnitService
        .createMeasureUnit(acronym, name)
        .subscribe(() => {
          this.createToast('Successfully updated the measure unit!');
          this.measureUnitService.findMeasureUnits();
          this.navCtrl.pop();
        });
    }
  }

  private createForm() {
    let name = '';
    let acronym = '';
    if (this.isUpdate()) {
      name = this.measureUnit.name;
      acronym = this.measureUnit.acronym;
    }
    this.measureUnitForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      acronym: new FormControl(acronym, Validators.required)
    });
  }

  private isUpdate(): boolean {
    return this.mode === MeasureUnitFormMode.Update;
  }

  private createToast(message: string) {
    const config: ToastOptions = {
      message,
      duration: 2500
    };
    this.toastCtrl.create(config).present();
  }
}
