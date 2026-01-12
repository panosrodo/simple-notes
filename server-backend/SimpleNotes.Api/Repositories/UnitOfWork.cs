using SimpleNotes.Api.Data;
using SimpleNotes.Api.Repositories.Interfaces;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDBContext _db;

    public UnitOfWork(AppDBContext db, INoteRepository notes, IUserRepository users)
    {
        _db = db;
        Notes = notes;
        Users = users;
    }

    public INoteRepository Notes { get; }
    public IUserRepository Users { get; }

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();
}