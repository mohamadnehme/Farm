using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IProposalRepository
    {
        void Add(FarmProposal farm);
        void Update(FarmProposal farm);
        void Delete(FarmProposal farm);
        Task<List<FarmProposal>> GetFarmProposals();
        Task<FarmProposal> GetFarmProposal(int id);
        void SaveChanges();
        Task<List<FarmProposal>> GetFarmProposalsA();
    }
}
