using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SeedUserDto
{
    public required string Id { get; set; } = null!;
    public required string Email { get; set; } = null!;
    public required DateOnly DateOfBirth { get; set; }
    public string? ImageUrl { get; set; }
    public required string DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActive { get; set; }
    public required string Gender { get; set; }
    public string? Description { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
}