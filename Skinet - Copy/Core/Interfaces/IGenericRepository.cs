using Core.Entities;
using Core.Spesification;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<List<T>> ListAllAsync();
        Task<T> GetEntityWithSpec(ISpesification<T> spec);
        Task<List<T>> ListAsync(ISpesification<T> spec);
        Task<int> CountAsync(ISpesification<T> spec);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        public void SaveChange();
    }
}
