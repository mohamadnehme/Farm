using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Interfaces
{
    public interface IPhotoRepository
    {
        public void Add(Photos photo);
        public List<Photos> GetPhotos(int farmId, bool isProposal);
        public void SaveChanges();
    }
}
