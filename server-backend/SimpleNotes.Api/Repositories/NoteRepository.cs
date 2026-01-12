using Microsoft.EntityFrameworkCore;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.Repositories.Interfaces;

namespace SimpleNotes.Api.Repositories;

public class NoteRepository : INoteRepository
{
    private readonly AppDBContext _db;

    public NoteRepository(AppDBContext db)
    {
        _db = db;
    }

    public async Task<List<Note>> GetAllByUserAsync(int userId)
    {
        return await _db.Notes
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.IsPinned)
            .ThenByDescending(n => n.ModifiedAt)
            .ToListAsync();
    }

    public async Task<Note?> GetByIdAsync(int noteId, int userId)
    {
        return await _db.Notes
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);
    }

    public async Task AddAsync(Note note)
    {
        _db.Notes.Add(note);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Note note)
    {
        _db.Notes.Update(note);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Note note)
    {
        _db.Notes.Remove(note);
        await _db.SaveChangesAsync();
    }
}