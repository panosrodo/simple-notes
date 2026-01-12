using Microsoft.EntityFrameworkCore;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.DTOs;
using SimpleNotes.Api.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SimpleNotes.Api.Services;

public class NoteService : INoteService
{
    private readonly AppDBContext _db;
    private readonly IHttpContextAccessor _http;

    public NoteService(AppDBContext db, IHttpContextAccessor http)
    {
        _db = db;
        _http = http;
    }

    public async Task<List<NoteDTO>> GetAllAsync()
    {
        var userId = GetUserIdFromToken();

        var notes = await _db.Notes
            .AsNoTracking()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.IsPinned)
            .ThenByDescending(n => n.ModifiedAt)
            .ToListAsync();

        return notes.Select(ToDto).ToList();
    }

    public async Task<NoteDTO> GetByIdAsync(int noteId)
    {
        var userId = GetUserIdFromToken();

        var note = await _db.Notes
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note is null)
            throw new KeyNotFoundException("Note not found.");

        return ToDto(note);
    }

    public async Task<NoteDTO> AddAsync(AddNoteDTO dto)
    {
        var userId = GetUserIdFromToken();

        var note = new Note
        {
            Title = dto.Title,
            Content = dto.Content,
            Tags = dto.Tags,
            IsPinned = dto.IsPinned,
            UserId = userId
        };

        _db.Notes.Add(note);
        await _db.SaveChangesAsync();

        return ToDto(note);
    }

    public async Task UpdateAsync(int noteId, UpdateNoteDTO dto)
    {
        var userId = GetUserIdFromToken();

        var note = await _db.Notes
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note is null)
            throw new KeyNotFoundException("Note not found.");

        note.Title = dto.Title;
        note.Content = dto.Content;
        note.Tags = dto.Tags;
        note.IsPinned = dto.IsPinned;
        note.ModifiedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int noteId)
    {
        var userId = GetUserIdFromToken();

        var note = await _db.Notes
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note is null)
            throw new KeyNotFoundException("Note not found.");

        _db.Notes.Remove(note);
        await _db.SaveChangesAsync();
    }

    // =========================
    // Helpers
    // =========================
    private int GetUserIdFromToken()
    {
        var principal = _http.HttpContext?.User;
        if (principal?.Identity?.IsAuthenticated != true)
            throw new UnauthorizedAccessException("Not authenticated.");

        var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(sub, out var userId))
            throw new UnauthorizedAccessException("Invalid token.");

        return userId;
    }

    private static NoteDTO ToDto(Note n) => new NoteDTO
    {
        Id = n.Id,
        Title = n.Title,
        Content = n.Content,
        Tags = n.Tags,
        IsPinned = n.IsPinned,
        TimeStamp = n.ModifiedAt
    };
}