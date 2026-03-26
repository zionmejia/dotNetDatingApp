import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../interface/members';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-member-photos',
  imports: [],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos: ReturnType<typeof toSignal<Photo[]>>;

  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')!;

    this.photos = toSignal(this.memberService.getMemberPhotos(memberId), { initialValue: [] });
  }
}
