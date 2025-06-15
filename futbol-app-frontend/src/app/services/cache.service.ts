import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  setItem(key: string, value: any): void {
    const item = {
      value: value,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  getItem(key: string): any | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsedItem = JSON.parse(item);
    const now = new Date().getTime();

    if (now - parsedItem.timestamp > this.CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return parsedItem.value;
  }
}
