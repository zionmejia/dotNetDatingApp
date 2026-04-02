import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../interface/members';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../interface/pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  public editMode = signal(false);
  public member = signal<Member | null>(null);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  public getMembers(memberParams: MemberParams) {
    let params= new HttpParams();

    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('orderBy', memberParams.orderBy);
    if (memberParams.gender) params = params.append('gender', memberParams.gender);
    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'members', {params}).pipe(
      tap(() => {
        localStorage.setItem('filters', JSON.stringify(memberParams));
      })
    );

  }

  public getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap((member) => {
        this.member.set(member);
      }),
    );
  }

  public getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  public updateMember(member: EditableMember) {
    return this.http.put(this.baseUrl + 'members', member);
  }

  public uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  public setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.id, photo);
  }

  public deletePhoto(id: string) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + id);
  }
}
