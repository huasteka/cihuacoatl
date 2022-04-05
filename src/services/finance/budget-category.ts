import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  BudgetCategoryRead,
  BudgetCategoryWrite,
  transformOne,
  transformMany,
} from 'src/models/finance/budget-category';
import { FinanceResponse as R } from 'src/models/finance/response';

export type BudgetCategoryListCallback = (result: BudgetCategoryRead[]) => void;

@Injectable()
export class BudgetCategoryService {
  public budgetCategoryListListener = new Subject<BudgetCategoryRead[]>([]);

  private readonly requestUrl = `${environment.services.finance}/api/budget-categories`;

  constructor(private http: HttpClient) { }

  public createBudgetCategory(budgetGroupId: number, name: string) {
    const budgetCategory = new BudgetCategoryWrite(name, { id: budgetGroupId });
    return this.http.post<R<BudgetCategoryWrite>>(this.requestUrl, budgetCategory).pipe(
      single(),
      map(transformOne),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateBudgetCategory(budgetCategoryId: number, budgetGroupId: number, name: string) {
    const budgetCategory = new BudgetCategoryWrite(name, { id: budgetGroupId });
    const requestUrl = `${this.requestUrl}/${budgetCategoryId}`;
    return this.http.put<void>(requestUrl, { ...budgetCategory, id: budgetCategoryId }).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteBudgetCategory(budgetCategoryId: number) {
    return this.http.delete<void>(`${this.requestUrl}/${budgetCategoryId}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findBudgetCategoryById(budgetCategoryId: number): Observable<BudgetCategoryRead> {
    return this.http
      .get<R<BudgetCategoryWrite>>(`${this.requestUrl}/${budgetCategoryId}`)
      .pipe(single(), map(transformOne));
  }

  public emitFindBudgetCategoryList(): void {
    this.http.get<R<BudgetCategoryWrite[]>>(this.requestUrl)
      .pipe(single(), map(transformMany))
      .subscribe(m => this.budgetCategoryListListener.next(m));
  }

  public listenFindBudgetCategoryList(callback: BudgetCategoryListCallback): Subscription {
    return this.budgetCategoryListListener.subscribe(callback);
  }
}
