import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { YACATECUHTLI_URL } from '../apis';
import { BudgetGroupRead, BudgetGroupWrite, transformBudgetGroupRequest } from '../../models/budget-group';

@Injectable()
export class BudgetGroupService {
  private requestUrl = YACATECUHTLI_URL + '/api/budget-groups';
  budgetGroupListListener = new Subject<BudgetGroupRead[]>();

  constructor(private http: HttpClient) {
  }

  createBudgetGroup(name: string,) {
    const budgetGroup = new BudgetGroupWrite(name);
    return this.http.post(`${this.requestUrl}`, budgetGroup);
  }

  updateBudgetGroup(budgetGroupId: number, name: string) {
    const budgetGroup = new BudgetGroupWrite(name);
    return this.http.put(`${this.requestUrl}/${budgetGroupId}`, {id: budgetGroupId, ...budgetGroup});
  }

  deleteBudgetGroup(budgetGroupId: number) {
    return this.http.delete(`${this.requestUrl}/${budgetGroupId}`);
  }

  findBudgetGroups() {
    return this.http
      .get<BudgetGroupRead[]>(this.requestUrl)
      .map(transformBudgetGroupRequest);
  }

  sendEventToListener() {
    this.findBudgetGroups().subscribe((budgetGroups: BudgetGroupRead[]) => {
      this.budgetGroupListListener.next(budgetGroups);
    });
  }
}
