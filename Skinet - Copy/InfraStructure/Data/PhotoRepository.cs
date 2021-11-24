using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace InfraStructure.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly StoreContext context;

        public PhotoRepository(StoreContext context)
        {
            this.context = context;
        }

        public void Add(Photos photo)
        {
            context.Add(photo);
        }

        public List<Photos> GetPhotos(int farmId, bool isProposal)
        {
            return context.Photos.Where(p => p.FarmId == farmId && p.IsProposal == isProposal).ToList();
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }
    }
}
