import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

import { HUITZILOPOCHTLI_URL } from '../apis';
import { SupplierRead, SupplierWrite } from '../../models/supplier';

@Injectable()
export class SupplierService {
  private requestUrl = HUITZILOPOCHTLI_URL + '/api/suppliers';
  supplierListener = new Subject<SupplierRead[]>();

  constructor(private http: HttpClient) {
  }

  createSupplier(name: string, trade_name: string, legal_document_code: string) {
    const supplier = new SupplierWrite(name, trade_name, legal_document_code);
    return this.http.post(this.requestUrl, supplier);
  }

  updateSupplier(supplierId: number, name: string, trade_name: string, legal_document_code: string) {
    const supplier = new SupplierWrite(name, trade_name, legal_document_code);
    return this.http.put(`${this.requestUrl}/${supplierId}`, supplier);
  }

  deleteSupplier(supplierId: number) {
    return this.http.delete(`${this.requestUrl}/${supplierId}`);
  }

  findSuppliers() {
    return this.http.get<SupplierRead[]>(this.requestUrl)
      .map((response: any) => response.data);
  }

  sendEventToListener() {
    this.findSuppliers().subscribe((supplierList: SupplierRead[]) => {
      this.supplierListener.next(supplierList);
    });
  }
}
