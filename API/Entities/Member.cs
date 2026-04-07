using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace API.Entities;

public class Member
{
    public string Id { get; set; } = null!;
    public required DateOnly DateOfBirth { get; set; }
    public string? ImageUrl { get; set; }
    public required string DisplayName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; }
    public string? Description { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }

    //nav props
    [System.Text.Json.Serialization.JsonIgnore]
    public List<Photo> Photos { get; set; } = [];

    [System.Text.Json.Serialization.JsonIgnore]
    public List<MemberLike> LikedByMembers { get; set; } = [];

    [System.Text.Json.Serialization.JsonIgnore]
    public List<MemberLike> LikedMembers { get; set; } = [];

    [JsonIgnore] public List<Message> MessagesSent { get; set; } = [];
    [JsonIgnore] public List<Message> MessagesReceived { get; set; } = [];

    [System.Text.Json.Serialization.JsonIgnore]
    [ForeignKey(nameof(Id))]
    public AppUser User { get; set; } = null!;
}