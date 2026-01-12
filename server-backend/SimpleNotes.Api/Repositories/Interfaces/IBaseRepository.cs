namespace SimpleNotes.Api.Repositories.Interfaces
{
    public interface IBaseRepository<T>
    {
        /// <summary>
        /// Asynchronously adds a single entity to the database
        /// </summary>
        Task AddAsync(T entity);

        /// <summary>
        /// Asynchronously adds multiple entities to the database in one batch
        /// </summary>
        Task AddRangeAsync(IEnumerable<T> entities);

        /// <summary>
        /// Marks an entity as updated in the database (does not immediately save)
        /// </summary>
        Task UpdateAsync(T entity);

        /// <summary>
        /// Removes an entity by ID; returns true if successfully marked for deletion
        /// </summary>
        Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Retrieves a single entity by primary key ID
        /// </summary>
        Task<T?> GetAsync(int id);

        /// <summary>
        /// Retrieves all entities of type T from the database
        /// </summary>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>
        /// Returns the total count of entities of type T
        /// </summary>
        Task<int> GetCountAsync();
    }
}
