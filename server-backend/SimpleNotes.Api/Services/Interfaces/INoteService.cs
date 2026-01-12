using SimpleNotes.Api.DTOs;

namespace SimpleNotes.Api.Services.Interfaces
{
    public interface INoteService
    {
        Task<List<NoteDTO>> GetAllAsync();
        Task<NoteDTO> GetByIdAsync(int noteId);
        Task<NoteDTO> AddAsync(AddNoteDTO dto);
        Task UpdateAsync(int noteId, UpdateNoteDTO dto);
        Task DeleteAsync(int noteId);
    }
}
