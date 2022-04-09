/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  buildProduct,
  buildProductList,
  ProductDecoded,
  ProductResponse,
  ProductWrite,
} from 'src/models/sales/product';

export type ProductListCallback = (result: ProductDecoded[]) => void;

@Injectable()
export class ProductService {
  public productListListener = new Subject<ProductDecoded[]>([]);

  private readonly requestUrl = `${environment.services.sales}/api/products`;

  constructor(private http: HttpClient) { }

  public createProduct(code: string, name: string, description: string) {
    const product: ProductWrite = { code, name, description };
    return this.http.post<ProductResponse>(this.requestUrl, product).pipe(
      single(),
      map(buildProduct),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateProduct(product_id: number, code: string, name: string, description: string) {
    const product: ProductWrite = { code, name, description };
    return this.http.put<void>(`${this.requestUrl}/${product_id}`, product).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteProduct(product_id: number) {
    return this.http.delete<void>(`${this.requestUrl}/${product_id}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findProductById(productId: number): Observable<ProductDecoded> {
    return this.http
      .get<ProductResponse>(`${this.requestUrl}/${productId}`)
      .pipe(single(), map(buildProduct));
  }

  public emitFindProductList(): void {
    this.http.get<ProductResponse>(this.requestUrl)
      .pipe(single(), map(buildProductList))
      .subscribe(m => this.productListListener.next(m));
  }

  public listenFindProductList(callback: ProductListCallback): Subscription {
    return this.productListListener.subscribe(callback);
  }
}
