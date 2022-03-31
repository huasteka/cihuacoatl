import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { MeasureUnitRead, MeasureUnitWrite } from 'src/models/inventory/measure-unit';

@Injectable()
export class MeasureUnitService {
  public measureUnitListener = new Subject<MeasureUnitRead[]>();

  private readonly requestUrl = `${environment.services.storage}/api/measure_units`;

  constructor(private http: HttpClient) { }

  public createMeasureUnit(acronym: string, name: string) {
    const measureUnit = new MeasureUnitWrite(name, acronym);
    return this.http.post(this.requestUrl, measureUnit);
  }

  public updateMeasureUnit(measureUnitId: number, acronym: string, name: string) {
    const measureUnit = new MeasureUnitWrite(name, acronym);
    return this.http.put(`${this.requestUrl}/${measureUnitId}`, measureUnit);
  }

  public deleteMeasureUnit(measureUnitId: number) {
    return this.http.delete(`${this.requestUrl}/${measureUnitId}`);
  }

  public findMeasureUnits() {
    return this.http
      .get<MeasureUnitRead[]>(this.requestUrl)
      .pipe(switchMap((response: any) => response.data));
  }

  public sendEventToListener() {
    return this.findMeasureUnits()
      .subscribe((measureUnitList: MeasureUnitRead[]) =>
        this.measureUnitListener.next(measureUnitList)
      );
  }
}
