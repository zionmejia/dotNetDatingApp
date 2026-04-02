import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { Member, Photo } from '../../../interface/members';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../interface/userInterface';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  public route = inject(ActivatedRoute);
  public accountService = inject(AccountService);
  public memberService = inject(MemberService);
  public paramMap = toSignal(this.route.paramMap);
  public photos = signal<Photo[]>([]);
  public loading = signal(false);
  public isCurrentUser = computed(() => {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    return this.accountService.currentUser()?.id === id;
  });

  ngOnInit() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')!;
    this.memberService.getMemberPhotos(memberId).subscribe({
      next: (photos) => this.photos.set(photos),
    });
  }

  public onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        if (this.photos().length === 0) {
          this.updateMainPhotoLocal(photo)
        }
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);
      },
      error: (error) => {
        console.log('Error uploading photo', error);
        this.loading.set(false);
      },
    });
  }

  public setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setCurrentUser(currentUser as User);
        this.memberService.member.update(
          (member) =>
            ({
              ...member,
              imageUrl: photo.url,
            }) as Member,
        );
      },
    });
  }

  private updateMainPhotoLocal(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
  }

  public deletePhoto(photoId: string) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((x) => x.id !== photoId));
      },
    });
  }
}
