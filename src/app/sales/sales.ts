import { Component } from '@angular/core';

import { ClientPage } from './client/client';
import { SupplierPage } from './supplier/supplier';
import { ProductPage } from './product/product';
import { MerchandisePage } from './merchandise/merchandise';

@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html'
})
export class SalesPage {
  clientPage = ClientPage;
  supplierPage = SupplierPage;
  productPage = ProductPage;
  merchandisePage = MerchandisePage;
}
