import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { SupplierWrite } from '../../../../models/supplier';
import { SupplierService } from '../../../../services/sales/supplier';
import { PresentationUtil } from '../../../../utils/presentation';

export enum SupplierFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-supplier-form',
  templateUrl: './supplier-form.html'
})
export class SupplierFormPage implements OnInit {
  mode: string = SupplierFormMode.Create;
  supplier: SupplierWrite;
  supplierForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private supplierService: SupplierService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.supplier = this.navParams.get('supplier');
    }
    this.createForm();
  }

  onSubmit() {
    const {name, trade_name, legal_document_code} = this.supplierForm.value;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating supplier...');
      this.supplierService
        .updateSupplier(this.supplier.id, name, trade_name, legal_document_code)
        .subscribe(() => this.onFinishSupplierOperation(
          'Successfully updated the supplier!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating supplier...');
      this.supplierService
        .createSupplier(name, trade_name, legal_document_code)
        .subscribe(() => this.onFinishSupplierOperation(
          'The supplier was successfully created!',
          loading
        ));
    }
  }

  private onFinishSupplierOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.supplierService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let name = '';
    let trade_name = '';
    let legal_document_code = '';
    if (this.isUpdate()) {
      ({name, trade_name, legal_document_code} = this.supplier);
    }
    this.supplierForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      trade_name: new FormControl(trade_name, Validators.required),
      legal_document_code: new FormControl(legal_document_code, Validators.required)
    });
  }

  private isUpdate(): boolean {
    return this.mode === SupplierFormMode.Update;
  }
}
