import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data, { withCredentials: true });
  }

  register(data: { name: string; email: string; password: string; password_confirmation: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  forgot(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data, { withCredentials: true });
  }

  reset(data: { token: string; email: string; password: string; password_confirmation: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data, { withCredentials: true });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
