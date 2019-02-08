import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loading, NavController, NavParams } from 'ionic-angular';

import { ClientWrite } from '../../../../models/client';
import { ClientService } from '../../../../services/sales/client';
import { PresentationUtil } from '../../../../utils/presentation';

export enum ClientFormMode {
  Create = 'New',
  Update = 'Edit'
}

@Component({
  selector: 'page-client-form',
  templateUrl: './client-form.html'
})
export class ClientFormPage implements OnInit {
  mode: string = ClientFormMode.Create;
  client: ClientWrite;
  clientForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private presentationUtil: PresentationUtil,
              private clientService: ClientService) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if (this.isUpdate()) {
      this.client = this.navParams.get('client');
    }
    this.createForm();
  }

  onSubmit() {
    const {name, legal_document_code} = this.clientForm.value;
    if (this.isUpdate()) {
      const loading = this.presentationUtil.createLoading('Updating client...');
      this.clientService
        .updateClient(this.client.id, name, legal_document_code)
        .subscribe(() => this.onFinishClientOperation(
          'Successfully updated the client!',
          loading
        ));
    } else {
      const loading = this.presentationUtil.createLoading('Creating client...');
      this.clientService
        .createClient(name, legal_document_code)
        .subscribe(() => this.onFinishClientOperation(
          'The client was successfully created!',
          loading
        ));
    }
  }

  private onFinishClientOperation(message: string, loading: Loading) {
    loading.dismiss();
    this.presentationUtil.createToast(message);
    this.clientService.sendEventToListener();
    this.navCtrl.pop();
  }

  private createForm() {
    let name = '';
    let legal_document_code = '';
    if (this.isUpdate()) {
      ({name, legal_document_code} = this.client);
    }
    this.clientForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      legal_document_code: new FormControl(legal_document_code, Validators.required)
    });
  }

  private isUpdate(): boolean {
    return this.mode === ClientFormMode.Update;
  }
}
