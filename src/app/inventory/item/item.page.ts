import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  NavController,
  ToastController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ItemRead } from 'src/models/inventory/item';
import { ItemService } from 'src/services/inventory/item';

@Component({
  selector: 'app-page-item',
  templateUrl: './item.page.html'
})
export class ItemPage implements OnInit, OnDestroy {
  public itemList: ItemRead[];

  private subscription$: Subscription;

  constructor(
    private navigationCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private itemService: ItemService,
  ) { }

  public ngOnInit(): void {
    this.subscription$ = this.itemService.listenFindItemList(
      (itemList: ItemRead[]) => this.itemList = itemList
    );

    this.itemService.emitFindItemList();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public handleCreateClick() {
    this.navigationCtrl.navigateForward('/home/modules/inventory/items/create', {});
  }

  public handleUpdateClick(payload: ItemRead): void {
    this.navigationCtrl.navigateForward(`/home/modules/inventory/items/update/${payload.id}`);
  }

  public async handleActionSheetClick(item: ItemRead) {
    const deleteHandler = () => this.itemService.deleteItem(item.id)
      .toPromise()
      .then(this.handleDeleteSuccess)
      .catch(this.handleDeleteError);

    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash-outline',
      role: 'destructive',
      handler: deleteHandler,
    }, {
      text: 'Update',
      icon: 'pencil-outline',
      handler: () => this.handleUpdateClick(item)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];

    const actionSheet = await this.actionSheetCtrl.create({ header: 'Item Operations', buttons });
    await actionSheet.present();
  }

  private handleDeleteSuccess = async () => {
    const message = 'The selected item was successfully deleted!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
    this.itemService.emitFindItemList();
  };

  private handleDeleteError = async () => {
    const message = 'Could not delete this item!';
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top' });
    await toast.present();
  };
}
