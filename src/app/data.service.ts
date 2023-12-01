import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private calculateClickedSource = new Subject<{ x: string, y: string }>();

  calculateClicked$ = this.calculateClickedSource.asObservable();

  emitCalculateClicked(event: { x: string, y: string }): void {
    this.calculateClickedSource.next(event);
  }
}

export class ArrayDataService {
  private calculateClickedSource = new Subject<{ x: string[], y: string[] }>();

  calculateClicked$ = this.calculateClickedSource.asObservable();

  emitCalculateClicked(data: { x: string[], y: string[] }): void {
    this.calculateClickedSource.next(data);
  }
}