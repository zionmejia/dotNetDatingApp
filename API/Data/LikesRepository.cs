using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(string predicate, string memberId, MemberParams memberParams)
    {
        var likesQuery = context.Likes.AsQueryable();

        IQueryable<Member> membersQuery;

        switch (predicate)
        {
            case "liked":
                membersQuery = likesQuery
                    .Where(x => x.SourceMemberId == memberId)
                    .Select(x => x.TargetMember);
                break;

            case "likedBy":
                membersQuery = likesQuery
                    .Where(x => x.TargetMemberId == memberId)
                    .Select(x => x.SourceMember);
                break;

            default: // mutual
                membersQuery = likesQuery
                    .Where(l => l.SourceMemberId == memberId)
                    .Where(l => likesQuery.Any(other =>
                        other.SourceMemberId == l.TargetMemberId &&
                        other.TargetMemberId == memberId))
                    .Select(l => l.TargetMember);
                break;
        }

        // Apply member filters using helper
        membersQuery = MemberFilterHelper.ApplyMemberFilters(membersQuery, memberParams);

        // Paginate
        return await PaginationHelper.CreateAsync(membersQuery, memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
            .Where(x => x.SourceMemberId == memberId)
            .Select(x => x.TargetMemberId)
            .ToListAsync();
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}