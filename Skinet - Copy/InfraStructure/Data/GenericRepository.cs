using Core.Entities;
using Core.Interfaces;
using Core.Spesification;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfraStructure.Data
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly StoreContext context;

        public GenericRepository(StoreContext context)
        {
            this.context = context;
        }

        public void Add(T entity)
        {
            context.Set<T>().Add(entity);
        }
        public void SaveChange()
        {
            context.SaveChanges();
        }
        public async Task<int> CountAsync(ISpesification<T> spec)
        {
            return await ApplySpesification(spec).CountAsync();
        }

        public void Delete(T entity)
        {
            context.Set<T>().Remove(entity);
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public async Task<T> GetEntityWithSpec(ISpesification<T> spec)
        {
            return await ApplySpesification(spec).FirstOrDefaultAsync();
        }

        public async Task<List<T>> ListAllAsync()
        {
            return await context.Set<T>().ToListAsync();
        }

        public async Task<List<T>> ListAsync(ISpesification<T> spec)
        {
            return await ApplySpesification(spec).ToListAsync();
        }

        public void Update(T entity)
        {
            context.Set<T>().Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
        }

        private IQueryable<T> ApplySpesification(ISpesification<T> spec)
        {
            return SpesificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
        }
    }
}
