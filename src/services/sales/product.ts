import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

import { HUITZILOPOCHTLI_URL } from '../apis';
import { ProductRead, ProductWrite } from '../../models/product';

@Injectable()
export class ProductService {
  private requestUrl = HUITZILOPOCHTLI_URL + '/api/products';
  productListener = new Subject<ProductRead[]>();

  constructor(private http: HttpClient) {
  }

  createProduct(code: string, name: string, description?: string) {
    const product = new ProductWrite(code, name, description);
    return this.http.post(this.requestUrl, product);
  }

  updateProduct(productId: number, code: string, name: string, description?: string) {
    const product = new ProductWrite(code, name, description);
    return this.http.put(`${this.requestUrl}/${productId}`, product);
  }

  deleteProduct(productId: number) {
    return this.http.delete(`${this.requestUrl}/${productId}`);
  }

  findProducts() {
    return this.http.get<ProductRead[]>(this.requestUrl)
      .map((response: any) => response.data);
  }

  sendEventToListener() {
    this.findProducts().subscribe((productList: ProductRead[]) => {
      this.productListener.next(productList);
    });
  }
}
