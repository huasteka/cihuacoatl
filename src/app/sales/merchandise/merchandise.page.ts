import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  NavController,
  ToastController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { MerchandiseDecoded } from 'src/models/sales/merchandise';
import { MerchandiseService } from 'src/services/sales/merchandise';

@Component({
  selector: 'app-page-merchandise',
  templateUrl: 'merchandise.page.html',
  styleUrls: ['merchandise.page.scss'],
})
export class MerchandisePage implements OnInit, OnDestroy {
  public merchandiseList: MerchandiseDecoded[];

  private subscription$: Subscription;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private merchandiseService: MerchandiseService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.merchandiseService.listenFindMerchandiseList(
      (merchandiseList: MerchandiseDecoded[]) => this.merchandiseList = merchandiseList,
    );

    this.merchandiseService.emitFindMerchandiseList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  handleCreateClick() {
    this.navCtrl.navigateForward('/home/modules/sales/merchandises/create');
  }

  handleUpdateClick(payload: MerchandiseDecoded) {
    this.navCtrl.navigateForward(`/home/modules/sales/merchandises/update/${payload.id}`);
  }

  public async handleActionSheetClick(payload: MerchandiseDecoded) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () =>
        this.merchandiseService.deleteMerchandise(payload.id)
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

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Merchandises Operations', buttons });
    await actionSheet.present();
  }

  handleDeleteSuccess = async () => {
    const message = 'Merchandise was successfully deleted!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
    this.merchandiseService.emitFindMerchandiseList();
  };

  handleDeleteError = async () => {
    const message = 'Could not delete this merchandise!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };
}
