import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUser: User | null = null;

  set(user: User): void {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  get(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('user');
      this.currentUser = stored ? JSON.parse(stored) : null;
    }
    return this.currentUser;
  }

  clear(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
  }
}
