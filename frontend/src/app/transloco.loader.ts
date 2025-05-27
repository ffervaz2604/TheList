import { Translation, TRANSLOCO_LOADER } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export const translocoLoader = {
  provide: TRANSLOCO_LOADER,
  useClass: TranslocoHttpLoader
};
