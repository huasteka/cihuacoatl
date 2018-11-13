import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { YACATECUHTLI_URL } from '../apis';
import { BudgetCategoryRead, BudgetCategoryWrite, transformBudgetCategoryRequest } from '../../models/budget-category';
import { BudgetGroupWrite } from '../../models/budget-group';

@Injectable()
export class BudgetCategoryService {
  private requestUrl = YACATECUHTLI_URL + '/api/budget-categories';
  budgetCategoryListListener = new Subject<BudgetCategoryRead[]>();

  constructor(private http: HttpClient) {
  }

  createBudgetCategory(name: string, group: BudgetGroupWrite) {
    const budgetCategory = new BudgetCategoryWrite(name, group);
    return this.http.post(`${this.requestUrl}`, budgetCategory);
  }

  updateBudgetCategory(budgetCategoryId: number, name: string, group: BudgetGroupWrite) {
    const budgetCategory = new BudgetCategoryWrite(name, group);
    return this.http.put(`${this.requestUrl}/${budgetCategoryId}`, {id: budgetCategoryId, ...budgetCategory});
  }

  deleteBudgetCategory(budgetCategoryId: number) {
    return this.http.delete(`${this.requestUrl}/${budgetCategoryId}`);
  }

  findBudgetCategories() {
    return this.http
      .get<BudgetCategoryRead[]>(this.requestUrl)
      .map(transformBudgetCategoryRequest);
  }

  sendEventToListener() {
    this.findBudgetCategories().subscribe((budgetCategories: BudgetCategoryRead[]) => {
      this.budgetCategoryListListener.next(budgetCategories);
    });
  }
}
