using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleNotes.Api.DTOs;
using SimpleNotes.Api.Services.Interfaces;

namespace SimpleNotes.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NoteController : ControllerBase
{
    private readonly INoteService _noteService;

    public NoteController(INoteService noteService)
    {
        _noteService = noteService;
    }

    // GET: api/note
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var notes = await _noteService.GetAllAsync();
        return Ok(notes);
    }

    // GET: api/note/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var note = await _noteService.GetByIdAsync(id);
        return Ok(note);
    }

    // POST: api/note
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddNoteDTO dto)
    {
        var note = await _noteService.AddAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = note.Id }, note);
    }

    // PUT: api/note/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateNoteDTO dto)
    {
        await _noteService.UpdateAsync(id, dto);
        return NoContent();
    }

    // DELETE: api/note/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _noteService.DeleteAsync(id);
        return NoContent();
    }
}