import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import padStart from 'lodash/padStart';

import { MerchandiseFormMode, MerchandiseFormPage } from './merchandise-form/merchandise-form';
import { MerchandiseRead, MerchandiseWrite } from '../../../models/sales/merchandiseandise';
import { MerchandiseService } from '../../../services/sales/merchandise';
import { PresentationUtil } from '../../../utils/presentation';

@Component({
  selector: 'page-merchandise',
  templateUrl: './merchandise.html'
})
export class MerchandisePage implements OnInit, OnDestroy {
  subscription: Subscription;
  merchandiseList: MerchandiseRead[];

  constructor(private merchandiseService: MerchandiseService,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private presentationUtil: PresentationUtil) {
    const loading = this.presentationUtil.createLoading('Now Loading...');
    this.subscription = merchandiseService.merchandiseListener
      .subscribe((merchandiseList: MerchandiseRead[]) => {
        this.merchandiseList = merchandiseList;
        loading.dismiss();
      });
  }

  ngOnInit(): void {
    this.merchandiseService.sendEventToListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onMerchandiseCreate() {
    this.navCtrl.push(MerchandiseFormPage, {});
  }

  onMerchandiseDeleteSuccess = () => {
    this.presentationUtil.createToast('The selected merchandise was successfully deleted!');
  };

  onMerchandiseDeleteError = () => {
    this.presentationUtil.createToast('Could not delete this merchandise!');
  };

  onNavigateToUpdate(payload: MerchandiseRead): void {
    this.merchandiseService.findMerchandiseById(payload.id).subscribe((merchandise: MerchandiseRead) => {
      this.navCtrl.push(MerchandiseFormPage, {
        mode: MerchandiseFormMode.Update,
        merchandise: MerchandiseWrite.createMerchandise(merchandise)
      });
    });
  }

  onMerchandiseActionSheet(merchandise: MerchandiseRead) {
    const buttons: ActionSheetButton[] = [{
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => {
        this.merchandiseService
          .deleteMerchandise(merchandise.id)
          .subscribe(this.onMerchandiseDeleteSuccess, this.onMerchandiseDeleteError);
      }
    }, {
      text: 'Update',
      icon: 'create',
      handler: () => this.onNavigateToUpdate(merchandise)
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }];
    this.actionSheetCtrl.create({title: 'Merchandise Operations', buttons}).present();
  }

  getPurchasePrice({ purchase_price }: MerchandiseWrite) {
    return this.getPaddedPrice(purchase_price);
  }

  getRetailPrice({ retail_price }: MerchandiseWrite) {
    return this.getPaddedPrice(retail_price);
  }

  private getPaddedPrice(price: number) {
    return padStart(price, 8);
  }
}
