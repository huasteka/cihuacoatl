import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { ClientFormMode, ClientFormPage } from './client-form/client-form';
import { ClientRead, ClientWrite } from '../../../models/sales/clientclient';
import { ClientService } from '../../../services/sales/client';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-client',
  templateUrl: 'client.html'
})
export class ClientPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  clientList: ClientRead[];

  constructor(private clientService: ClientService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    loading.present();
    this.subscription = this.clientService.clientListener
      .subscribe((clientList: ClientRead[]) => {
        this.clientList = clientList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.clientService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClientCreate() {
    this.navCtrl.push(ClientFormPage, {mode: ClientFormMode.Create});
  }

  onClientDeleteSuccess = () => {
    this.clientService.sendEventToListener();
    this.presentationUtil.createToast('Client was successfully deleted!');
  };

  onClientDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this client!');
  };

  onClientActionSheet(payload: ClientRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.clientService
          .deleteClient(payload.id)
          .subscribe(this.onClientDeleteSuccess, this.onClientDeleteError);
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
    this.actionSheetCtrl.create({title: 'Clients Operations', buttons}).present();
  }

  onNavigateToForm(payload: ClientRead) {
    this.navCtrl.push(ClientFormPage, {
      client: ClientWrite.createClient(payload),
      mode: ClientFormMode.Update
    });
  }
}
