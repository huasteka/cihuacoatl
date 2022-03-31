import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { MeasureUnitWrite } from '../../../../models/inventory/measure-unitasure-unit';
import { MeasureUnitService } from '../../../../services/inventory/measure-unit';
import { PresentationUtil } from '../../../../utils/presentation';

export enum MeasureUnitFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-measure-unit-form',
  templateUrl: './measure-unit-form.html'
})
export class MeasureUnitFormPage implements OnInit {
  mode: string = MeasureUnitFormMode.Create;
  measureUnit: MeasureUnitWrite;
  measureUnitForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
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
      const loading = this.presentationUtil.createLoading('Updating measure unit...');
      this.measureUnitService
        .updateMeasureUnit(this.measureUnit.id, acronym, name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'Successfully updated the measure unit!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating measure unit...');
      this.measureUnitService
        .createMeasureUnit(acronym, name)
        .subscribe(() => this.onFinishMeasureUnitOperation(
          'A measure unit was successfully created!',
          loading
        ));
    }
  }

  private onFinishMeasureUnitOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.measureUnitService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let name = '';
    let acronym = '';
    if (this.isUpdate()) {
      ({name, acronym} = this.measureUnit);
    }
    this.measureUnitForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      acronym: new FormControl(acronym, Validators.required)
    });
  }

  private isUpdate(): boolean {
    return this.mode === MeasureUnitFormMode.Update;
  }
}
