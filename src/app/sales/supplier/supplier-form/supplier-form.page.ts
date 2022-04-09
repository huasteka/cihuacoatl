/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { SupplierDecoded } from 'src/models/sales/supplier';
import { SupplierService } from 'src/services/sales/supplier';

export enum SupplierFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-supplier-form',
  templateUrl: 'supplier-form.page.html',
  styleUrls: ['supplier-form.page.scss'],
})
export class SupplierFormPage implements OnInit {
  public formMode: string;
  public supplierForm: FormGroup;

  private supplierId: number;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private supplierService: SupplierService
  ) { }

  public ngOnInit(): void {
    this.formMode = this.route.snapshot.data.formMode;

    if (this.isUpdate()) {
      this.buildUpdateForm();
      return;
    }

    this.buildForm();
  }

  public async handleSubmit(): Promise<void> {
    const { name, trade_name, legal_document_code } = this.supplierForm.value;

    if (this.isUpdate()) {
      await this.handleUpdate(name, trade_name, legal_document_code);
      return;
    }

    await this.handleCreate(name, trade_name, legal_document_code);
  }

  private async handleCreate(name: string, trade_name: string, legal_document_code: string) {
    const loading = await this.loadingCtrl.create({ message: 'Creating supplier...' });
    await loading.present();

    this.supplierService
      .createSupplier(name, trade_name, legal_document_code)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('The supplier was successfully created!');
          this.supplierService.emitFindSupplierList();
          this.navCtrl.navigateBack('/home/modules/sales/suppliers');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the supplier!');
        }
      );
  }

  private async handleUpdate(name: string, trade_name: string, legal_document_code: string) {
    const loading = await this.loadingCtrl.create({ message: 'Updating supplier...' });
    await loading.present();

    this.supplierService
      .updateSupplier(this.supplierId, name, trade_name, legal_document_code)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('Successfully updated the supplier!');
          this.supplierService.emitFindSupplierList();
          this.navCtrl.navigateBack('/home/modules/sales/suppliers');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the supplier!');
        },
      );
  }

  private async buildToast(message: string) {
    const toastConfig = { message, duration: 3000, keyboardClose: true };
    const toast = await this.toastCtrl.create({ ...toastConfig, position: 'top' });
    await toast.present();
  }

  private buildForm(supplier?: SupplierDecoded) {
    const { name = '', trade_name = '', legal_document_code = '' } = supplier || {};
    this.supplierForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      trade_name: new FormControl(trade_name, Validators.required),
      legal_document_code: new FormControl(legal_document_code, Validators.required)
    });
  }

  private buildUpdateForm() {
    this.supplierId = this.route.snapshot.params.supplier_id;
    this.supplierService.findSupplierById(this.supplierId).subscribe(
      (supplier: SupplierDecoded) => this.buildForm(supplier),
    );
  }

  private isUpdate(): boolean {
    return this.formMode === SupplierFormMode.update;
  }
}
