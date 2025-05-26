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

  addProduct(listId: number, product: { name: string; quantity: number; purchased?: boolean }) {
    return this.http.post<{ data: any }>(
      `http://localhost:8000/api/lists/${listId}/products`,
      product,
      this.getHeaders()
    );
  }

  updateProduct(productId: number, data: { name?: string; quantity?: number; purchased?: boolean }) {
    return this.http.put<{ data: any }>(
      `http://localhost:8000/api/products/${productId}`,
      data,
      this.getHeaders()
    );
  }

  deleteProduct(productId: number) {
    return this.http.delete<{ message: string }>(
      `http://localhost:8000/api/products/${productId}`,
      this.getHeaders()
    );
  }

  getArchived(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      'http://localhost:8000/api/lists?archived=1',
      this.getHeaders()
    );
  }

  unarchiveList(id: number) {
    return this.http.put<{ data: any }>(
      `http://localhost:8000/api/lists/${id}`,
      { archived: false },
      this.getHeaders()
    );
  }

}
