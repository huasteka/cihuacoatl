import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { MeasureUnitRead } from 'src/models/inventory/measure-unit';
import { MeasureUnitService } from 'src/services/inventory/measure-unit';

export enum MeasureUnitFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-measure-unit-form',
  templateUrl: 'measure-unit-form.page.html',
  styleUrls: ['measure-unit-form.page.scss'],
})
export class MeasureUnitFormPage implements OnInit {
  public formMode: string;
  public measureUnitForm: FormGroup;

  private measureUnitId: number;

  constructor(
    private route: ActivatedRoute,
    private navigationCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private measureUnitService: MeasureUnitService
  ) { }

  public ngOnInit(): void {
    this.formMode = this.route.snapshot.data.formMode;

    if (this.isUpdate()) {
      this.buildUpdateForm();
      return;
    }

    this.measureUnitForm = new FormGroup({
      name: new FormControl('', Validators.required),
      acronym: new FormControl('', Validators.required)
    });
  }

  public async handleSubmit(): Promise<void> {
    const { name, acronym } = this.measureUnitForm.value;

    if (this.isUpdate()) {
      await this.handleUpdate(name, acronym);
      return;
    }

    this.handleCreate(name, acronym);
  }

  private async handleCreate(name: string, acronym: string): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Creating measure unit...' });
    await loading.present();

    this.measureUnitService
      .createMeasureUnit(name, acronym)
      .subscribe(
        async () => {
          await loading.dismiss();
          this.handleSubscribe('A measure unit was successfully created!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('It was not possible to update this measure unit!');
        }
      );
  }

  private async handleUpdate(name: string, acronym: string): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Updating measure unit...' });
    await loading.present();

    this.measureUnitService
      .updateMeasureUnit(this.measureUnitId, name, acronym)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.handleSubscribe('Successfully updated the measure unit!');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('It was not possible to update this measure unit!');
        }
      );
  }

  private buildUpdateForm(): void {
    this.measureUnitId = this.route.snapshot.params?.measureUnitId;

    this.measureUnitService.findMeasureUnitById(this.measureUnitId).subscribe(
      ({ attributes }: MeasureUnitRead) => {
        this.measureUnitForm = new FormGroup({
          name: new FormControl(attributes.name, Validators.required),
          acronym: new FormControl(attributes.acronym, Validators.required)
        });
      }
    );
  }

  private async buildToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  }

  private async handleSubscribe(message: string) {
    await this.buildToast(message);

    this.measureUnitService.emitFindMeasureUnitList();
    this.navigationCtrl.navigateBack('/home/modules/inventory/measure-units');
  }

  private isUpdate(): boolean {
    return this.formMode === MeasureUnitFormMode.update;
  }
}
