import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class ListService {
  private apiUrl = 'http://localhost:8000/api/lists';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  getAll(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(this.apiUrl, this.getHeaders());
  }

  create(data: { name: string }): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getHeaders());
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  addProduct(listId: number, product: { name: string; quantity: number }) {
    return this.http.post<{ data: any }>(
      `http://localhost:8000/api/lists/${listId}/products`,
      product,
      this.getHeaders()
    );
  }

}
