import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

import { MeasureUnitRead, MeasureUnitWrite } from '../models/measure-unit';

@Injectable()
export class MeasureUnitService {
  private requestUrl = 'http://localhost:3000/api/measure_units';
  measureUnitListener = new Subject<MeasureUnitRead[]>();

  constructor(private http: HttpClient) {
  }

  createMeasureUnit(acronym: string, name: string) {
    const measureUnit = new MeasureUnitWrite(name, acronym);
    return this.http.post(`${this.requestUrl}`, measureUnit);
  }

  updateMeasureUnit(measureUnitId: number, acronym: string, name: string) {
    const measureUnit = new MeasureUnitWrite(name, acronym);
    return this.http.put(`${this.requestUrl}/${measureUnitId}`, measureUnit);
  }

  deleteMeasureUnit(measureUnitId: number) {
    return this.http.delete(`${this.requestUrl}/${measureUnitId}`);
  }

  findMeasureUnits() {
    return this.http.get<MeasureUnitRead[]>(`${this.requestUrl}`)
      .map((response: any) => {
        this.measureUnitListener.next(response.data);
        return response.data;
      })
      .subscribe();
  }
}
