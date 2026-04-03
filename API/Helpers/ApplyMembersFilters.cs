using API.Entities;
using API.Helpers;
using System.Linq;

namespace API.Helpers
{
    public static class MemberFilterHelper
    {
        // Apply filters and ordering to an IQueryable<Member>
        public static IQueryable<Member> ApplyMemberFilters(this IQueryable<Member> query, MemberParams memberParams)
        {
            if (!string.IsNullOrEmpty(memberParams.Gender))
            {
                query = query.Where(m => m.Gender == memberParams.Gender);
            }

            // Age filter
            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));
            query = query.Where(m => m.DateOfBirth >= minDob && m.DateOfBirth <= maxDob);

            // Ordering
            query = memberParams.OrderBy switch
            {
                "created" => query.OrderByDescending(m => m.CreatedAt),
                _ => query.OrderByDescending(m => m.LastActive)
            };

            return query;
        }
    }
}