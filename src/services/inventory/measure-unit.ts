import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject as Subject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, single } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { MeasureUnitRead, MeasureUnitWrite } from 'src/models/inventory/measure-unit';
import { InventoryResponse as R, InventoryError as E } from 'src/models/inventory/response';

export type MeasureUnitCallback = (result: MeasureUnitRead) => void;
export type MeasureUnitListCallback = (result: MeasureUnitRead[]) => void;

@Injectable()
export class MeasureUnitService {
  private readonly requestUrl = `${environment.services.storage}/api/measure_units`;
  private measureUnitListener = new Subject<MeasureUnitRead>(null);
  private measureUnitListListener = new Subject<MeasureUnitRead[]>([]);

  constructor(private http: HttpClient) { }

  public createMeasureUnit(name: string, acronym: string): Observable<MeasureUnitRead> {
    const measureUnit = new MeasureUnitWrite(name, acronym);
    return this.http.post<R<MeasureUnitRead>>(this.requestUrl, measureUnit).pipe(
      single(),
      map(m => m.data),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public updateMeasureUnit(measureUnitId: number, name: string, acronym: string): Observable<void> {
    const measureUnit = new MeasureUnitWrite(name, acronym);
    const requestUrl = `${this.requestUrl}/${measureUnitId}`;
    return this.http.put<void>(requestUrl, measureUnit).pipe(
      single(),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public deleteMeasureUnit(measureUnitId: number): Observable<void> {
    return this.http.delete<void>(`${this.requestUrl}/${measureUnitId}`).pipe(
      single(),
      catchError((e: E) => throwError(e.errors)),
    );
  }

  public findMeasureUnitById(measureUnitId: number): Observable<MeasureUnitRead> {
    return this.http
      .get<R<MeasureUnitRead>>(`${this.requestUrl}/${measureUnitId}`)
      .pipe(single(), map(m => m.data));
  }

  public emitFindMeasureUnitById(measureUnitId: number): void {
    this.findMeasureUnitById(measureUnitId).subscribe(m => this.measureUnitListener.next(m));
  }

  public emitFindMeasureUnitList(): void {
    this.http.get<R<MeasureUnitRead[]>>(this.requestUrl)
      .pipe(single(), map(r => r.data))
      .subscribe(m => this.measureUnitListListener.next(m));
  }

  public listenFindMeasureUnitById(callback: MeasureUnitCallback): Subscription {
    const subscription = this.measureUnitListener.pipe(filter(s => s !== null)).subscribe(callback);
    subscription.add(() => this.measureUnitListener.next(null));
    return subscription;
  }

  public listenFindMeasureUnitList(callback: MeasureUnitListCallback): Subscription {
    return this.measureUnitListListener.subscribe(callback);
  }
}
