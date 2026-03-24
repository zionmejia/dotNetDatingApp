import { inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCreds, RegisterCreds, User } from '../../interface/userInterface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnInit {
  private http = inject(HttpClient);
  public currentUser = signal<User | null>(null);
  baseUrl = 'https://localhost:7252/api/';

  ngOnInit() {
    return this.http.get(this.baseUrl + 'members');
  }

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap((user) => {
        if (user) {
         this.setCurrentUser(user);
        }
      }),
    );
  }

  setCurrentUser(user:User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

}
