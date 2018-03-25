import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController, ToastController, ToastOptions } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { ItemFormMode, ItemFormPage } from './item-form/item-form';
import { ItemRead, ItemWrite } from '../../../models/item';
import { ItemService } from '../../../services/item';

@Component({
  selector: 'page-item',
  templateUrl: './item.html'
})
export class ItemPage implements OnInit, OnDestroy {
  subscription: Subscription;
  itemList: ItemRead[];

  constructor(private itemService: ItemService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private toastCtrl: ToastController) {
    this.subscription = itemService.itemListener
      .subscribe((itemList: ItemRead[]) => {
        this.itemList = itemList;
      });
  }

  ngOnInit(): void {
    this.itemService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onItemCreate() {
    this.navCtrl.push(ItemFormPage, {});
  }

  onItemDeleteSuccess = () => {
    this.createToast('The selected item was successfully deleted!');
  };

  onItemDeleteError = () => {

  };

  onNavigateToUpdate(payload: ItemRead): void {
    this.itemService.findItemById(payload.id).subscribe((item: ItemRead) => {
      this.navCtrl.push(ItemFormPage, {
        mode: ItemFormMode.Update,
        item: ItemWrite.createItem(item)
      });
    });
  }

  onItemActionSheet(item: ItemRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.itemService.deleteItem(item.id)
          .subscribe(this.onItemDeleteSuccess, this.onItemDeleteError);
      }
    }, {
      text: 'Update',
      icon: 'create',
      handler: () => this.onNavigateToUpdate(item)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];
    this.actionSheetCtrl.create({title: 'Item Operations', buttons}).present();
  }

  private createToast(message: string) {
    const options: ToastOptions = {
      message,
      duration: 2500
    };
    this.toastCtrl.create(options).present();
  }
}
