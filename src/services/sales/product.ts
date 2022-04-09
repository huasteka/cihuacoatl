import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ProductRead, ProductWrite } from 'src/models/sales/product';

@Injectable()
export class ProductService {
  public productListener = new Subject<ProductRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/products`;

  constructor(private http: HttpClient) { }

  public createProduct(code: string, name: string, description?: string) {
    const product = new ProductWrite(code, name, description);
    return this.http.post(this.requestUrl, product);
  }

  public updateProduct(productId: number, code: string, name: string, description?: string) {
    const product = new ProductWrite(code, name, description);
    return this.http.put(`${this.requestUrl}/${productId}`, product);
  }

  public deleteProduct(productId: number) {
    return this.http.delete(`${this.requestUrl}/${productId}`);
  }

  public findProducts() {
    return this.http
      .get<ProductRead[]>(this.requestUrl)
      .pipe(map((response: any) => response.data));
  }

  public sendEventToListener() {
    return this.findProducts()
      .subscribe((productList: ProductRead[]) =>
        this.productListener.next(productList)
      );
  }
}
