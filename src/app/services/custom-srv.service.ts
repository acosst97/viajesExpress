import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertData } from '../interfaces/alert';

@Injectable({
  providedIn: 'root'
})
export class CustomSrvService {
  private toastSubject = new BehaviorSubject<AlertData | null>(null);
  public toast$ = this.toastSubject.asObservable();
  private active = false;

  showToast(data: AlertData) {
    if (this.active) {
      return;
    }
    this.active = true;
    this.toastSubject.next(data);
    setTimeout(() => {
      this.toastSubject.next(null);
      this.active = false;
    }, data.duration);
  }


  constructor() { }
}
