using SimpleNotes.Api.Data;

namespace SimpleNotes.Api.Repositories.Interfaces
{
    public interface INoteRepository
    {
        Task<List<Note>> GetAllByUserAsync(int userId);
        Task<Note?> GetByIdAsync(int noteId, int userId);
        Task AddAsync(Note note);
        Task UpdateAsync(Note note);
        Task DeleteAsync(Note note);
    }
}
