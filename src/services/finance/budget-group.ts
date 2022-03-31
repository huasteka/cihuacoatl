import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  BudgetGroupRead,
  BudgetGroupWrite,
  transformBudgetGroupRequest
} from 'src/models/finance/budget-group';

@Injectable()
export class BudgetGroupService {
  public budgetGroupListListener = new Subject<BudgetGroupRead[]>();

  private readonly requestUrl = `${environment.services.finance}/api/budget-groups`;

  constructor(private http: HttpClient) { }

  public createBudgetGroup(name: string) {
    const budgetGroup = new BudgetGroupWrite(name);
    return this.http.post(`${this.requestUrl}`, budgetGroup);
  }

  public updateBudgetGroup(budgetGroupId: number, name: string) {
    const budgetGroup = new BudgetGroupWrite(name);
    return this.http.put(`${this.requestUrl}/${budgetGroupId}`, { id: budgetGroupId, ...budgetGroup });
  }

  public deleteBudgetGroup(budgetGroupId: number) {
    return this.http.delete(`${this.requestUrl}/${budgetGroupId}`);
  }

  public findBudgetGroups() {
    return this.http
      .get<BudgetGroupRead[]>(this.requestUrl)
      .pipe(map(transformBudgetGroupRequest));
  }

  public sendEventToListener() {
    return this.findBudgetGroups()
      .subscribe((budgetGroups: BudgetGroupRead[]) =>
        this.budgetGroupListListener.next(budgetGroups)
      );
  }
}
