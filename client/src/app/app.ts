import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import Nav from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { Home } from '../features/home/home';
import { User } from '../interface/userInterface';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Home],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // fixed typo: styleUrls instead of styleUrl
})
export class App implements OnInit {
  protected readonly title = signal('Dating app');
  protected members = signal<User[]>([]); // use an array signal
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private accountService = inject(AccountService);

  async ngOnInit() {
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>('https://localhost:7252/api/members'));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
