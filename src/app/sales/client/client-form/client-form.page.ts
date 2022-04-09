/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

import { ClientDecoded } from 'src/models/sales/client';
import { ClientService } from 'src/services/sales/client';

export enum ClientFormMode {
  create = 'New',
  update = 'Edit'
}

@Component({
  selector: 'app-page-client-form',
  templateUrl: 'client-form.page.html',
  styleUrls: ['client-form.page.scss'],
})
export class ClientFormPage implements OnInit {
  public formMode: string;
  public clientForm: FormGroup;

  private clientId: number;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private clientService: ClientService
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
    const { name, legal_document_code } = this.clientForm.value;

    if (this.isUpdate()) {
      await this.handleUpdate(name, legal_document_code);
      return;
    }

    await this.handleCreate(name, legal_document_code);
  }

  private async handleCreate(name: string, legal_document_code: string) {
    const loading = await this.loadingCtrl.create({ message: 'Creating client...' });
    await loading.present();

    this.clientService
      .createClient(name, legal_document_code)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('The client was successfully created!');
          this.clientService.emitFindClientList();
          this.navCtrl.navigateBack('/home/modules/sales/clients');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the client!');
        }
      );
  }

  private async handleUpdate(name: string, legal_document_code: string) {
    const loading = await this.loadingCtrl.create({ message: 'Updating client...' });
    await loading.present();

    this.clientService
      .updateClient(this.clientId, name, legal_document_code)
      .subscribe(
        async () => {
          await loading.dismiss();
          await this.buildToast('Successfully updated the client!');
          this.clientService.emitFindClientList();
          this.navCtrl.navigateBack('/home/modules/sales/clients');
        },
        async () => {
          await loading.dismiss();
          await this.buildToast('Could not updated the client!');
        },
      );
  }

  private async buildToast(message: string) {
    const toastConfig = { message, duration: 3000, keyboardClose: true };
    const toast = await this.toastCtrl.create({ ...toastConfig, position: 'top' });
    await toast.present();
  }

  private buildForm(client?: ClientDecoded) {
    const { name = '', legal_document_code = '' } = client || {};
    this.clientForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      legal_document_code: new FormControl(legal_document_code, Validators.required)
    });
  }

  private buildUpdateForm() {
    this.clientId = this.route.snapshot.params.client_id;
    this.clientService.findClientById(this.clientId).subscribe(
      (client: ClientDecoded) => this.buildForm(client),
    );
  }

  private isUpdate(): boolean {
    return this.formMode === ClientFormMode.update;
  }
}
