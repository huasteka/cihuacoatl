/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { SupplierRead, SupplierWrite } from 'src/models/sales/supplier';

@Injectable()
export class SupplierService {
  public supplierListener = new Subject<SupplierRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/suppliers`;

  constructor(private http: HttpClient) { }

  public createSupplier(name: string, trade_name: string, legal_document_code: string) {
    const supplier = new SupplierWrite(name, trade_name, legal_document_code);
    return this.http.post(this.requestUrl, supplier);
  }

  public updateSupplier(supplierId: number, name: string, trade_name: string, legal_document_code: string) {
    const supplier = new SupplierWrite(name, trade_name, legal_document_code);
    return this.http.put(`${this.requestUrl}/${supplierId}`, supplier);
  }

  public deleteSupplier(supplierId: number) {
    return this.http.delete(`${this.requestUrl}/${supplierId}`);
  }

  public findSuppliers() {
    return this.http
      .get<SupplierRead[]>(this.requestUrl)
      .pipe(map((response: any) => response.data));
  }

  public sendEventToListener() {
    return this.findSuppliers()
      .subscribe((supplierList: SupplierRead[]) =>
        this.supplierListener.next(supplierList)
      );
  }
}
