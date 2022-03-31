import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { ItemFormMode, ItemFormPage } from './item-form/item-form';
import { ItemRead, ItemWrite } from '../../../models/inventory/itemntory/item';
import { ItemService } from '../../../services/inventory/item';
import { PresentationUtil } from '../../../utils/presentation';

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
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    this.subscription = itemService.itemListener
      .subscribe((itemList: ItemRead[]) => {
        this.itemList = itemList;
        loading.dismiss();
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
    this.presentationUtil.createToast('The selected item was successfully deleted!');
  };

  onItemDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this item!');
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
        this.itemService
          .deleteItem(item.id)
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
}
