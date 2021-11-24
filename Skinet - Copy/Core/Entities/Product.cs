using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Product: BaseEntity
    {
        public string Name { get; set; }
        public decimal ROI { get; set; }
        public int FarmCycle { get; set; }
        public string Location { get; set; }
        public decimal Interest { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public int UnitQuantity { get; set; }
        public int TotalQuantity { get; set; }
        public bool isSoldOut { get; set; }
        public ICollection<Invester> Investers { get; set; }
    }
}
