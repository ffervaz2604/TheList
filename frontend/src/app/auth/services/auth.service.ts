import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      headers: {
        Accept: 'application/json'
      }
    });
  }


  register(data: { name: string; email: string; password: string; password_confirmation: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, {
      headers: {
        Accept: 'application/json'
      }
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: {
        Accept: 'application/json'
      }
    });
  }

  forgot(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data, {
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
    return this.http.post(`${this.apiUrl}/reset-password`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
