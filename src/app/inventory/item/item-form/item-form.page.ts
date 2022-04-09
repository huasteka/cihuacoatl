/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ItemRead, ItemWrite } from 'src/models/inventory/item';
import { MeasureUnitRead } from 'src/models/inventory/measure-unit';
import { ItemService } from 'src/services/inventory/item';
import { MeasureUnitService } from 'src/services/inventory/measure-unit';

export enum ItemFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-item-form',
  templateUrl: 'item-form.page.html',
  styleUrls: ['item-form.page.scss'],
})
export class ItemFormPage implements OnInit, OnDestroy {
  public formMode: string;
  public itemId: number;
  public itemForm: FormGroup;
  public measureUnitList: MeasureUnitRead[] = [];

  private subscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private measureUnitService: MeasureUnitService,
    private itemService: ItemService,
  ) { }

  public ngOnInit(): void {
    this.formMode = this.route.snapshot.data.formMode;

    if (this.isUpdate()) {
      this.buildUpdateForm();
    } else {
      this.buildForm();
    }

    this.loadMeasureUnits();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public async handleSubmit() {
    const item = this.buildItemWrite();

    if (this.isUpdate()) {
      await this.handleUpdate(item);
      return;
    }

    await this.handleCreate(item);
  }

  private buildForm(item?: ItemWrite) {
    const {
      name = '',
      code = '',
      input_quantity = 0,
      output_quantity = 0,
      input_measure_unit_id = null,
      output_measure_unit_id = null,
    } = item || {};

    this.itemForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      code: new FormControl(code, Validators.required),
      input_measure_unit: new FormControl(input_measure_unit_id, Validators.required),
      input_quantity: new FormControl(input_quantity, [
        Validators.required,
        Validators.min(1),
      ]),
      output_measure_unit: new FormControl(output_measure_unit_id, Validators.required),
      output_quantity: new FormControl(output_quantity, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  private buildUpdateForm() {
    this.itemId = parseInt(this.route.snapshot.params?.itemId, 10);

    this.itemService.findItemById(this.itemId).subscribe(
      (item: ItemRead) => this.buildForm(
        ItemWrite.createItem(item)
      ),
    );
  }

  private buildItemWrite(): ItemWrite {
    const {
      name,
      code,
      input_measure_unit,
      input_quantity,
      output_measure_unit,
      output_quantity
    } = this.itemForm.value;

    const input = {
      measure_unit_id: input_measure_unit,
      quantity: input_quantity
    };

    const output = {
      measure_unit_id: output_measure_unit,
      quantity: output_quantity
    };

    return new ItemWrite(name, code, input, output);
  }

  private async handleCreate(item: ItemWrite): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Creating item...' });
    await loading.present();

    this.itemService.createItem(item).subscribe(
      async () => {
        await loading.dismiss();
        await this.handleSubscribe('An item was successfully created!');
      },
      async () => {
        await loading.dismiss();
        await this.buildToast('Could not create the item!');
      }
    );
  }

  private async handleUpdate(item: ItemWrite): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Updating item...' });
    await loading.present();

    this.itemService.updateItem(this.itemId, item).subscribe(
      async () => {
        await loading.dismiss();
        await this.handleSubscribe('The item was successfully updated!');
      },
      async () => {
        await loading.dismiss();
        await this.buildToast('Could not update the item!');
      }
    );
  }

  private async handleSubscribe(message: string): Promise<void> {
    await this.buildToast(message);
    this.itemService.emitFindItemList();
    this.navCtrl.navigateBack('/home/modules/inventory/items');
  }

  private async buildToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top', keyboardClose: true });
    await toast.present();
  }

  private loadMeasureUnits() {
    this.subscription$ = this.measureUnitService.listenFindMeasureUnitList(
      (measureUnitList: MeasureUnitRead[]) => this.measureUnitList = measureUnitList,
    );

    this.measureUnitService.emitFindMeasureUnitList();
  }

  private isUpdate() {
    return this.formMode === ItemFormMode.update;
  }
}
