namespace SimpleNotes.Api.DTOs
{
    public class NoteDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? Tags { get; set; }
        public bool IsPinned { get; set; }

        public DateTime TimeStamp { get; set; }
    }
}
