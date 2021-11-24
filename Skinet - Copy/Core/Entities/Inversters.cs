using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class Invester: BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string UserId { get; set; }
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int UnitQuantity { get; set; }
    }
}
