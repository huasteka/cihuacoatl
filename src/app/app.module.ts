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
import { FinancePage } from '../pages/finance/finance';
import { AuthService } from '../services/auth/auth';
import { UserService } from '../services/auth/user';
import { StorageService } from '../services/inventory/storage';
import { MeasureUnitService } from '../services/inventory/measure-unit';
import { ItemService } from '../services/inventory/item';
import { PresentationUtil } from '../utils/presentation';
import { AccountPage } from '../pages/finance/account/account';
import { AccountFormPage } from '../pages/finance/account/account-form/account-form';
import { AccountService } from '../services/finance/account';
import { BudgetGroupFormPage } from '../pages/finance/budget-group/budget-group-form/budget-group-form';
import { BudgetGroupPage } from '../pages/finance/budget-group/budget-group';
import { BudgetCategoryPage } from '../pages/finance/budget-category/budget-category';
import { BudgetCategoryFormPage } from '../pages/finance/budget-category/budget-category-form/budget-category-form';
import { BudgetGroupService } from '../services/finance/budget-group';
import { BudgetCategoryService } from '../services/finance/budget-category';
import { PaymentTypePage } from '../pages/finance/payment-type/payment-type';
import { PaymentTypeFormPage } from '../pages/finance/payment-type/payment-type-form/payment-type-form';
import { PaymentTypeService } from '../services/finance/payment-type';

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
    FinancePage,
    AccountPage,
    AccountFormPage,
    BudgetGroupPage,
    BudgetGroupFormPage,
    BudgetCategoryPage,
    BudgetCategoryFormPage,
    PaymentTypePage,
    PaymentTypeFormPage
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
    FinancePage,
    AccountPage,
    AccountFormPage,
    BudgetGroupPage,
    BudgetGroupFormPage,
    BudgetCategoryPage,
    BudgetCategoryFormPage,
    PaymentTypePage,
    PaymentTypeFormPage
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
    ItemService,
    AccountService,
    BudgetGroupService,
    BudgetCategoryService,
    PaymentTypeService,
    PresentationUtil
  ]
})
export class AppModule {
}
