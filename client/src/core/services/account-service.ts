import { computed, effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCreds, RegisterCreds, User } from '../../interface/userInterface';
import { tap } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnInit {
  public currentUser = signal<User | null>(null);
  public test = computed(() => {
    this.currentUser();
    console.log(this.test);
  });
  private baseUrl = 'https://localhost:7252/api/';
  private http = inject(HttpClient);
  private likesService = inject(LikesService);

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
        console.log('before set user');
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
    this.likesService.getLikeIds();
  }

  public logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.currentUser.set(null);
  }
}
