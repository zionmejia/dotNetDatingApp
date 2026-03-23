import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

interface Member {
  id: string;
  displayName: string;
  email: string;
  // add other fields your API returns
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // fixed typo: styleUrls instead of styleUrl
})
export class App implements OnInit {
  protected readonly title = signal('Dating app');
  protected members = signal<Member[]>([]); // use an array signal
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  async ngOnInit() {
    this.members.set(await this.getMembers());
  }

  getMembers() {
    try {
      return lastValueFrom(this.http.get<Member[]>('https://localhost:7252/api/members'))

    } catch (error) {
      console.error(error);
      throw error;
    }
    }
}
