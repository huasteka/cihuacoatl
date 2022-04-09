import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  NavController,
  ToastController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ClientDecoded } from 'src/models/sales/client';
import { ClientService } from 'src/services/sales/client';

@Component({
  selector: 'app-page-client',
  templateUrl: 'client.page.html'
})
export class ClientPage implements OnInit, OnDestroy {
  public clientList: ClientDecoded[];

  private subscription$: Subscription;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private clientService: ClientService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.clientService.listenFindClientList(
      (clientList: ClientDecoded[]) => this.clientList = clientList,
    );

    this.clientService.emitFindClientList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  handleCreateClick() {
    this.navCtrl.navigateForward('/home/modules/sales/clients/create');
  }

  handleUpdateClick(payload: ClientDecoded) {
    this.navCtrl.navigateForward(`/home/modules/sales/clients/update/${payload.id}`);
  }

  public async handleActionSheetClick(payload: ClientDecoded) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () =>
        this.clientService.deleteClient(payload.id)
          .toPromise()
          .then(this.handleDeleteSuccess)
          .catch(this.handleDeleteError)
    }, {
      text: 'Update',
      icon: 'pencil-outline',
      handler: () => this.handleUpdateClick(payload)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Clients Operations', buttons });
    await actionSheet.present();
  }

  handleDeleteSuccess = async () => {
    const message = 'Client was successfully deleted!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
    this.clientService.emitFindClientList();
  };

  handleDeleteError = async () => {
    const message = 'Could not delete this client!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };
}
