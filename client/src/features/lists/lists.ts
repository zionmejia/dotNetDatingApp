import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member, MemberParams } from '../../interface/members';
import { MemberCard } from '../members/member-card/member-card';
import { PaginatedResult } from '../../interface/pagination';
import { Paginator } from '../../shared/paginator/paginator';
import { FilterModal } from '../members/filter-modal/filter-modal';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  public likesService = inject(LikesService);
  public members = signal<Member[]>([]);
  public predicate = 'liked';
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  public memberParams: MemberParams = {
    minAge: 18,
    maxAge: 100,
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'lastActive',
  };
  private updatedParams = this.memberParams;

  public tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' },
  ];

  constructor() {
    this.loadLikes();
  }

  ngOnInit() {}

  public setPredicate(predicate: string) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.loadLikes();
    }
  }

  public loadLikes() {
    this.likesService.getLikes(this.predicate, this.memberParams).subscribe({
      next: (members) => this.paginatedMembers?.set(members),
    });
  }

  public onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadLikes();
  }

  openModal() {
    this.modal.open();
  }

  onCloseModal() {
    // console.log('close');
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = { ...data };
    this.updatedParams = { ...data };
    this.loadLikes();
  }

  resetFilter() {
    this.memberParams = {
      minAge: 18,
      maxAge: 100,
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'lastActive',
    };
    this.updatedParams = {
      minAge: 18,
      maxAge: 100,
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'lastActive',
    };
    this.loadLikes();
  }

  get displayMessage(): string {
    const defaultParams: MemberParams = {
      minAge: 18,
      maxAge: 100,
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'lastActive',
    };

    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(this.updatedParams.gender + 's');
    } else {
      filters.push('Males, Females');
    }

    if (
      this.updatedParams.minAge !== defaultParams.minAge ||
      this.memberParams.maxAge !== defaultParams.maxAge
    ) {
      filters.push(` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`);
    }

    filters.push(
      this.updatedParams.orderBy === 'lastActive' ? 'Recently active' : 'Newest members',
    );

    return filters.length > 0 ? `Selected: ${filters.join('  | ')}` : `all members`;
  }
}
