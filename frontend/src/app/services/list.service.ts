import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  getAll(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/lists`, this.getHeaders());
  }

  create(data: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/lists`, data, this.getHeaders());
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/lists/${id}`, data, this.getHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/lists/${id}`, this.getHeaders());
  }

  addProduct(listId: number, product: { name: string; quantity: number; purchased?: boolean }) {
    return this.http.post<{ data: any }>(
      `${this.baseUrl}/lists/${listId}/products`,
      product,
      this.getHeaders()
    );
  }

  updateProduct(productId: number, data: { name?: string; quantity?: number; purchased?: boolean }) {
    return this.http.put<{ data: any }>(
      `${this.baseUrl}/products/${productId}`,
      data,
      this.getHeaders()
    );
  }

  deleteProduct(productId: number) {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/products/${productId}`,
      this.getHeaders()
    );
  }

  getArchived(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/lists/archived`,
      this.getHeaders()
    );
  }

  unarchiveList(id: number) {
    return this.http.put<{ data: any }>(
      `${this.baseUrl}/lists/${id}`,
      { archived: false },
      this.getHeaders()
    );
  }

  shareList(listId: number, email: string) {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/lists/${listId}/share`,
      { email },
      this.getHeaders()
    );
  }

  revokeShare(listId: number, userId: number) {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/lists/${listId}/shared-users/${userId}`,
      this.getHeaders()
    );
  }

  getSharedUsers(listId: number) {
    return this.http.get<{ data: any[] }>(
      `${this.baseUrl}/lists/${listId}/shared-users`,
      this.getHeaders()
    );
  }

  updateQuantityPurchased(listId: number, productId: number, quantityPurchased: number) {
    return this.http.put<any>(
      `${this.baseUrl}/lists/${listId}/products/${productId}/quantity-purchased`,
      { quantity_purchased: quantityPurchased }
    );
  }

}
