import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  globalSearch(query: string) {
    if (!query.trim()) return of([]);

    const lists$ = this.http.get<any[]>(`${this.baseUrl}/search/lists?query=${query}`).pipe(
      map((lists) => lists.map((l) => ({ id: l.id, label: l.name, type: 'list' as const })))
    );

    const products$ = this.http.get<any[]>(`${this.baseUrl}/search/products?query=${query}`).pipe(
      map((products) => products.map((p) => ({ id: p.id, label: p.name, type: 'product' as const })))
    );

    return forkJoin([lists$, products$]).pipe(
      map(([lists, products]) => [...lists, ...products])
    );
  }
}
