import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member, MemberParams } from '../../interface/members';
import { PaginatedResult } from '../../interface/pagination';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<string[]>([]);

  public toggleLike(targetMemberId: string) {
    return this.http.post(`${this.baseUrl}likes/${targetMemberId}`, {});
  }

  public getLikes(predicate: string , memberParams:MemberParams) {

    let params = new HttpParams();

    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('orderBy', memberParams.orderBy);
    if (memberParams.gender) params = params.append('gender', memberParams.gender);
    return this.http
      .get<PaginatedResult<Member>>(this.baseUrl + 'likes?predicate=' + predicate, { params })
      .pipe(
        tap(() => {
          localStorage.setItem('filters', JSON.stringify(memberParams));
        }),
      );
  }

 public getLikeIds() {
    return this.http.get<string[]>(this.baseUrl + 'likes/list').subscribe({
      next: ids => this.likeIds.set(ids)
    });
  }

  private clearLikeIds() {
    this.likeIds.set([]);
  }

}
