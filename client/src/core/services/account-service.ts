import { inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCreds, RegisterCreds, User } from '../../interface/userInterface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnInit {
  public currentUser = signal<User | null>(null);
  public baseUrl = 'https://localhost:7252/api/';
  private http = inject(HttpClient);

  ngOnInit() {
    return this.http.get(this.baseUrl + 'members');
  }

  public register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  public login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  public setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  public logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
