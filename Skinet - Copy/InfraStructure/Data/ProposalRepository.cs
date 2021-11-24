using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfraStructure.Data
{
    public class ProposalRepository : IProposalRepository
    {
        private readonly StoreContext context;

        public ProposalRepository(StoreContext context)
        {
            this.context = context;
        }

        public void Add(FarmProposal farm)
        {
            context.FarmProposals.Add(farm);
        }

        public void Delete(FarmProposal farm)
        {
            context.FarmProposals.Remove(farm);
        }

        public async Task<FarmProposal> GetFarmProposal(int id)
        {
            return await context.FarmProposals.Include(p => p.Photos).Where(f => f.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<FarmProposal>> GetFarmProposals()
        {
            return await context.FarmProposals.Include(p => p.Photos).Where(f => !f.IsApproval).ToListAsync();
        }

        public async Task<List<FarmProposal>> GetFarmProposalsA()
        {
            return await context.FarmProposals.Include(p => p.Photos).Where(f => f.IsApproval).ToListAsync();
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        public void Update(FarmProposal farm)
        {
            context.FarmProposals.Update(farm);
        }
    }
}
