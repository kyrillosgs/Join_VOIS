import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(
    private window: Window
  ) { }

  getLocal(key: string): any {
    const weKey =  key;
    const data = this.window.localStorage.getItem(weKey);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /** save data in localstorage by key and value */
  setLocal(key: string, value: any): void {
    const weKey =  key;
    const data = value === undefined ? '' : JSON.stringify(value);
    this.window.localStorage.setItem(weKey, data);
  }

  /** save daa to session storage */
  setSessionStorage(key: string, value: any) {
    const data = value === undefined ? '' : JSON.stringify(value);
    this.window.localStorage.setItem(key, data);
  }
  /** get daa from session storage */
  getSessionStorage(key: string) {
    let data = this.window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /** remove key from session storage by key  */
  removeSession(key: string): void {
    // const weKey =  key;
    this.window.localStorage.removeItem(key);
  }
  /** remove key from localstorage by key  */
  removeLocal(key: string): void {
    // const weKey =  key;
    this.window.localStorage.removeItem(key);
  }


}
