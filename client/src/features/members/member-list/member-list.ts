import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member ,MemberParams } from '../../../interface/members';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from '../member-card/member-card';
import { PaginatedResult } from '../../../interface/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';
import { filter } from 'rxjs';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  private memberService = inject(MemberService);
  // @ts-ignore
  public memberParams: MemberParams = {
    minAge: 18,
    maxAge: 100,
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'lastActive',
  };
  private updatedParams = this.memberParams;

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }

  }

  ngOnInit() {
    this.loadMembers();

  }

  private loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: (result) => {
        this.paginatedMembers.set(result);
      },
    });
  }

  public onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onCloseModal() {
    // console.log('close');
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = {...data};
    this.updatedParams = {...data}
    this.loadMembers();
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
    this.loadMembers();
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

    return filters.length > 0 ? `Selected: ${filters.join('  | ')}`: `all members`
  }
}

