using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class FarmProposal: BaseEntity
    {
        public string OwnerName { get; set; }
        public string OwnershipType { get; set; }
        public string OwnerEmail { get; set; }
        public string Phone { get; set; }
        public string FarmName { get; set; }
        public string Area { get; set; }
        public string Location { get; set; }
        public string SoilType { get; set; }
        public string Description { get; set; }     
        public ICollection<Photos> Photos { get; set; }
        public int AgricultureHoldingNumber { get; set; }
        public bool IsApproval { get; set; } = false;
    }
}
