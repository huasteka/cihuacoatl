import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign-in/sign-in';
import { AuthService } from '../services/auth';
import { AuthInterceptor } from '../interceptors/auth';
import { InventoryPage } from '../pages/inventory/inventory';
import { StoragePage } from '../pages/inventory/storage/storage';
import { MeasureUnitPage } from '../pages/inventory/measure-unit/measure-unit';
import { StorageFormPage } from '../pages/inventory/storage/storage-form/storage-form';
import { InventoryService } from '../services/inventory';

@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    HomePage,
    InventoryPage,
    StoragePage,
    StorageFormPage,
    MeasureUnitPage
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
    HomePage,
    InventoryPage,
    StoragePage,
    StorageFormPage,
    MeasureUnitPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthService,
    InventoryService
  ]
})
export class AppModule {
}
