import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedListService {
  private apiUrl = 'http://localhost:8000/api/shared-lists';

  constructor(private http: HttpClient) { }

  getSharedLists(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
