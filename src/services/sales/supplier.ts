/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  buildSupplier,
  buildSupplierList,
  SupplierDecoded,
  SupplierResponse,
  SupplierWrite,
} from 'src/models/sales/supplier';

export type SupplierListCallback = (result: SupplierDecoded[]) => void;

@Injectable()
export class SupplierService {
  public supplierListListener = new Subject<SupplierDecoded[]>([]);

  private readonly requestUrl = `${environment.services.sales}/api/suppliers`;

  constructor(private http: HttpClient) { }

  public createSupplier(name: string, trade_name: string, legal_document_code: string) {
    const supplier: SupplierWrite = { name, trade_name, legal_document_code };
    return this.http.post<SupplierResponse>(this.requestUrl, supplier).pipe(
      single(),
      map(buildSupplier),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateSupplier(supplier_id: number, name: string, trade_name: string, legal_document_code: string) {
    const supplier: SupplierWrite = { name, trade_name, legal_document_code };
    return this.http.put<void>(`${this.requestUrl}/${supplier_id}`, supplier).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteSupplier(supplier_id: number) {
    return this.http.delete<void>(`${this.requestUrl}/${supplier_id}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findSupplierById(supplierId: number): Observable<SupplierDecoded> {
    return this.http
      .get<SupplierResponse>(`${this.requestUrl}/${supplierId}`)
      .pipe(single(), map(buildSupplier));
  }

  public emitFindSupplierList(): void {
    this.http.get<SupplierResponse>(this.requestUrl)
      .pipe(single(), map(buildSupplierList))
      .subscribe(m => this.supplierListListener.next(m));
  }

  public listenFindSupplierList(callback: SupplierListCallback): Subscription {
    return this.supplierListListener.subscribe(callback);
  }
}
