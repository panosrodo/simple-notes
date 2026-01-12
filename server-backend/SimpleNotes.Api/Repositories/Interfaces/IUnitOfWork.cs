namespace SimpleNotes.Api.Repositories.Interfaces
{
    public interface IUnitOfWork
    {
        INoteRepository Notes { get; }
        IUserRepository Users { get; }
        Task<int> SaveChangesAsync();
    }
}
