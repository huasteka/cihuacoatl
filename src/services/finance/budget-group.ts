import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  BudgetGroupRead,
  BudgetGroupWrite,
  transformOne,
  transformMany,
} from 'src/models/finance/budget-group';
import { FinanceResponse as R } from 'src/models/finance/response';

export type BudgetGroupListCallback = (result: BudgetGroupRead[]) => void;

@Injectable()
export class BudgetGroupService {
  public budgetGroupListListener = new Subject<BudgetGroupRead[]>([]);

  private readonly requestUrl = `${environment.services.finance}/api/budget-groups`;

  constructor(private http: HttpClient) { }

  public createBudgetGroup(name: string): Observable<BudgetGroupRead> {
    const budgetGroup = new BudgetGroupWrite(name);
    return this.http.post<R<BudgetGroupWrite>>(this.requestUrl, budgetGroup).pipe(
      single(),
      map(transformOne),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public updateBudgetGroup(budgetGroupId: number, name: string): Observable<void> {
    const budgetGroup = new BudgetGroupWrite(name);
    const requestUrl = `${this.requestUrl}/${budgetGroupId}`;
    return this.http.put<void>(requestUrl, { ...budgetGroup, id: budgetGroupId }).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public deleteBudgetGroup(budgetGroupId: number): Observable<void> {
    return this.http.delete<void>(`${this.requestUrl}/${budgetGroupId}`).pipe(
      single(),
      catchError(({ error }: HttpErrorResponse) => throwError(error.errors)),
    );
  }

  public findBudgetGroupById(budgetGroupId: number): Observable<BudgetGroupRead> {
    return this.http
      .get<R<BudgetGroupWrite>>(`${this.requestUrl}/${budgetGroupId}`)
      .pipe(single(), map(transformOne));
  }

  public emitFindBudgetGroupList(): void {
    this.http.get<R<BudgetGroupWrite[]>>(this.requestUrl)
      .pipe(single(), map(transformMany))
      .subscribe(m => this.budgetGroupListListener.next(m));
  }

  public listenFindBudgetGroupList(callback: BudgetGroupListCallback): Subscription {
    return this.budgetGroupListListener.subscribe(callback);
  }
}
