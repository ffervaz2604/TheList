import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, {
      headers: {
        Accept: 'application/json'
      }
    });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
  }

  register(data: { name: string; email: string; password: string; password_confirmation: string; role: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data, {
      headers: {
        Accept: 'application/json'
      }
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      headers: {
        Accept: 'application/json'
      }
    });
  }

  forgot(data: { email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, data, {
      headers: {
        Accept: 'application/json'
      }
    });
  }

  reset(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
