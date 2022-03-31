import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BudgetGroupWrite } from 'src/models/finance/budget-group';
import {
  BudgetCategoryRead,
  BudgetCategoryWrite,
  transformBudgetCategoryRequest
} from 'src/models/finance/budget-category';

@Injectable()
export class BudgetCategoryService {
  public budgetCategoryListListener = new Subject<BudgetCategoryRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/budget-categories`;

  constructor(private http: HttpClient) { }

  public createBudgetCategory(name: string, group: BudgetGroupWrite) {
    const budgetCategory = new BudgetCategoryWrite(name, group);
    return this.http.post(`${this.requestUrl}`, budgetCategory);
  }

  public updateBudgetCategory(budgetCategoryId: number, name: string, group: BudgetGroupWrite) {
    const budgetCategory = new BudgetCategoryWrite(name, group);
    return this.http.put(`${this.requestUrl}/${budgetCategoryId}`, { id: budgetCategoryId, ...budgetCategory });
  }

  public deleteBudgetCategory(budgetCategoryId: number) {
    return this.http.delete(`${this.requestUrl}/${budgetCategoryId}`);
  }

  public findBudgetCategories() {
    return this.http
      .get<BudgetCategoryRead[]>(this.requestUrl)
      .pipe(map(transformBudgetCategoryRequest));
  }

  public sendEventToListener() {
    return this.findBudgetCategories()
      .subscribe((budgetCategories: BudgetCategoryRead[]) =>
        this.budgetCategoryListListener.next(budgetCategories)
      );
  }
}
