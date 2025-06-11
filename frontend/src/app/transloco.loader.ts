import { Translation, TRANSLOCO_LOADER } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/frontend/assets/i18n/${lang}.json`);
  }
}

export const translocoLoader = {
  provide: TRANSLOCO_LOADER,
  useClass: TranslocoHttpLoader
};
