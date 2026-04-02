import { computed, effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCreds, RegisterCreds, User } from '../../interface/userInterface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnInit {
  public currentUser = signal<User | null>(null);
  public baseUrl = 'https://localhost:7252/api/';
  public test = computed(() => {
    this.currentUser()
    console.log(this.test)
  });

  private http = inject(HttpClient);

// constructor() {
//   effect(() => {
//     console.log(this.test);
//   });
// }

  ngOnInit() {
    return this.http.get(this.baseUrl + 'members');


  }

  public register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user) => {
        console.log(user);
        console.log("before set user");
        if (user) {
          this.setCurrentUser(user);
          console.log(this.currentUser());
          console.log('after set user');
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
    localStorage.removeItem('filters');
    this.currentUser.set(null);
  }
}
