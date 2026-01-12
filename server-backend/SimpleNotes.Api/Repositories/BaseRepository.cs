using Microsoft.EntityFrameworkCore;
using SimpleNotes.Api.Data;
using SimpleNotes.Api.Repositories.Interfaces;

namespace SimpleNotes.Api.Repositories
{
    /// <summary>
    /// Provides a generic base implementation of <see cref="IBaseRepository{T}"/> using Entity Framework Core.
    /// Contains common CRUD operations for entities that inherit from <see cref="BaseEntity"/>.
    /// </summary>
    /// <typeparam name="T">The entity type handled by this repository.</typeparam>
    public class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
    {
        protected readonly AppDBContext context;    // The EF database context injected via constructor
        protected readonly DbSet<T> dbSet;          // Generic DbSet for accessing entities of type T

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseRepository{T}"/> class.
        /// </summary>
        /// <param name="context">The database context instance.</param>
        public BaseRepository(AppDBContext context)
        {
            this.context = context;
            dbSet = context.Set<T>();
        }

        /// <summary>
        /// Adds a new entity to the context asynchronously.
        /// Note: this does not save changes to the database until SaveChanges is called on the context.
        /// </summary>
        /// <param name="entity">The entity to add.</param>
        public virtual async Task AddAsync(T entity) => await dbSet.AddAsync(entity);

        /// <summary>
        /// Adds multiple entities to the context asynchronously.
        /// Note: this does not save changes to the database until SaveChanges is called on the context.
        /// </summary>
        /// <param name="entities">The entities to add.</param>
        public virtual async Task AddRangeAsync(IEnumerable<T> entities) => await dbSet.AddRangeAsync(entities);

        /// <summary>
        /// Marks an entity as modified in the current context.
        /// The changes will be persisted when SaveChanges is called on the context.
        /// </summary>
        /// <param name="entity">The entity to update.</param>
        public virtual Task UpdateAsync(T entity)
        {
            dbSet.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        /// <summary>
        /// Attempts to delete an entity by its ID.
        /// Returns false if the entity is not found.
        /// </summary>
        /// <param name="id">The entity primary key ID.</param>
        /// <returns>True if the entity was found and marked for deletion; otherwise, false.</returns>
        public virtual async Task<bool> DeleteAsync(int id)
        {
            T? existingEntity = await GetAsync(id);
            if (existingEntity == null) return false;

            existingEntity.IsDeleted = true;
            existingEntity.DeletedAt = DateTime.UtcNow;
            existingEntity.ModifiedAt = DateTime.UtcNow;

            dbSet.Remove(existingEntity);
            return true;
        }

        /// <summary>
        /// Retrieves all entities of type <typeparamref name="T"/> from the database asynchronously.
        /// </summary>
        /// <returns>A collection containing all entities.</returns>
        public virtual async Task<IEnumerable<T>> GetAllAsync() => await dbSet.ToListAsync();

        /// <summary>
        /// Retrieves a single entity by its primary key ID asynchronously.
        /// </summary>
        /// <param name="id">The entity primary key ID.</param>
        /// <returns>The entity if found; otherwise, null.</returns>
        public virtual async Task<T?> GetAsync(int id) => await dbSet.FindAsync(id);

        /// <summary>
        /// Returns the total count of entities of type <typeparamref name="T"/> asynchronously.
        /// </summary>
        /// <returns>The number of entities.</returns>
        public virtual async Task<int> GetCountAsync() => await dbSet.CountAsync();

    }
}
