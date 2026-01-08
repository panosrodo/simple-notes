using System.ComponentModel.DataAnnotations;

namespace SimpleNotes.Api.DTOs
{
    public class AddNoteDTO
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = null!;

        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = null!;

        public string? Tags { get; set; }
        public bool IsPinned { get; set; }
    }
}
