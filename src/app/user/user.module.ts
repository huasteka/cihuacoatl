import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChangeNamePage } from './change-name/change-name.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserRoutingModule,
  ],
  declarations: [
    ChangeNamePage,
    ChangePasswordPage
  ]
})
export class UserModule { }
