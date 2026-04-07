import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../interface/pagination';
import { Message } from '../../interface/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  public getMessages(container: string , pageNumber: number , pageSize: number) {
    let params = new HttpParams();

    params = params.append('container', container);
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return this.http.get<PaginatedResult<Message>>(this.baseUrl + 'messages/', {params});

  }

  public getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + memberId);
  }

  public sendMessage(recipientId:string , content:string) {
     return this.http.post<Message>(this.baseUrl + 'messages/', {recipientId,content});
  }

  public deleteMessage(id:string) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

}
