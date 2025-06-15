import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedListService {
  private apiUrl = 'http://localhost:8000/api/shared-lists';

  constructor(private http: HttpClient) { }

  getSharedLists(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(
      this.apiUrl
    );
  }

}
