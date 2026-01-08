namespace SimpleNotes.Api.DTOs
{
    public class UserReadOnlyDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string UserRole { get; set; } = null!;
    }
}
