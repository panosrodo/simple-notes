using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleNotes.Api.Controllers;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.DTOs;
using SimpleNotes.Api.Exceptions;

namespace SimpleNotes.Api.Controllers
{
    public class NotesController : BaseController
    {
        public NotesController(AppDBContext db, AutoMapper.IMapper mapper)
            : base(db, mapper)
        {
        }

        // GET: api/notes/getall
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notes = await Db.Notes
                .AsNoTracking()
                .ToListAsync();

            var result = Mapper.Map<List<NoteDTO>>(notes);
            return Ok(result);
        }

        // GET: api/notes/get/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var note = await Db.Notes
                .AsNoTracking()
                .FirstOrDefaultAsync(n => n.Id == id);

            if (note == null)
                throw new EntityNotFoundException("Note", "Note not found");

            var result = Mapper.Map<NoteDTO>(note);
            return Ok(result);
        }

        // POST: api/notes/add
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] AddNoteDTO dto)
        {
            var note = Mapper.Map<Note>(dto);

            // προσωρινά hardcoded (μέχρι να μπει auth)
            note.UserId = 1;

            Db.Notes.Add(note);
            await Db.SaveChangesAsync();

            var result = Mapper.Map<NoteDTO>(note);
            return CreatedAtAction(nameof(Get), new { id = note.Id }, result);
        }

        // PUT: api/notes/update/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateNoteDTO dto)
        {
            var note = await Db.Notes.FirstOrDefaultAsync(n => n.Id == id);
            if (note == null)
                throw new EntityNotFoundException("Note", "Note not found");

            Mapper.Map(dto, note);
            await Db.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/notes/delete/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var note = await Db.Notes.FirstOrDefaultAsync(n => n.Id == id);
            if (note == null)
                throw new EntityNotFoundException("Note", "Note not found");

            Db.Notes.Remove(note);
            await Db.SaveChangesAsync();

            return NoContent();
        }
    }
}