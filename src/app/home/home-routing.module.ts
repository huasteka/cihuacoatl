import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'modules',
    component: HomePage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule),
      },
      {
        path: 'inventory',
        loadChildren: () => import('../inventory/inventory.module').then(m => m.InventoryPageModule),
      },
      {
        path: 'finance',
        loadChildren: () => import('../finance/finance.module').then(m => m.FinancePageModule),
      }
    ]
  },
  {
    path: 'settings',
    loadChildren: () => import('../user/user.module').then(m => m.UserModule),
  },
  {
    path: '',
    redirectTo: 'modules/dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
