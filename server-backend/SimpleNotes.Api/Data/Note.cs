namespace SimpleNotes.Api.Data
{
    public class Note : BaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? Tags { get; set; }
        public bool IsPinned { get; set; }
        public int UserId { get; set; }

        public User User { get; set; } = null!;
    }
}
