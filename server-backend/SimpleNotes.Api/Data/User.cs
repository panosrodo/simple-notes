using SimpleNotes.Api.Core.Enums;

namespace SimpleNotes.Api.Data
{
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public UserRole UserRole { get; set; }

        public ICollection<Note> Notes { get; set; } = [];
    }
}
