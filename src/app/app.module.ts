import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { AuthInterceptor } from '../interceptors/auth';
import { LongPressDirective } from '../directives/long-press';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { HomePage } from '../pages/home/home';
import { ChangeNamePage } from '../pages/user/change-name/change-name';
import { ChangePasswordPage } from '../pages/user/change-password/change-password';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { InventoryPage } from '../pages/inventory/inventory';
import { StoragePage } from '../pages/inventory/storage/storage';
import { StorageFormPage } from '../pages/inventory/storage/storage-form/storage-form';
import { StorageChildPage } from '../pages/inventory/storage/storage-child/storage-child';
import { MeasureUnitPage } from '../pages/inventory/measure-unit/measure-unit';
import { MeasureUnitFormPage } from '../pages/inventory/measure-unit/measure-unit-form/measure-unit-form';
import { ItemPage } from '../pages/inventory/item/item';
import { ItemFormPage } from '../pages/inventory/item/item-form/item-form';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { StorageService } from '../services/storage';
import { MeasureUnitService } from '../services/measure-unit';
import { ItemService } from '../services/item';
import { FinancePage } from '../pages/finance/finance';

@NgModule({
  declarations: [
    MyApp,
    LongPressDirective,
    SignInPage,
    SignUpPage,
    HomePage,
    DashboardPage,
    ChangeNamePage,
    ChangePasswordPage,
    InventoryPage,
    StoragePage,
    StorageChildPage,
    StorageFormPage,
    MeasureUnitPage,
    MeasureUnitFormPage,
    ItemPage,
    ItemFormPage,
    FinancePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage,
    HomePage,
    DashboardPage,
    ChangeNamePage,
    ChangePasswordPage,
    InventoryPage,
    StoragePage,
    StorageChildPage,
    StorageFormPage,
    MeasureUnitPage,
    MeasureUnitFormPage,
    ItemPage,
    ItemFormPage,
    FinancePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthService,
    UserService,
    StorageService,
    MeasureUnitService,
    ItemService
  ]
})
export class AppModule {
}
