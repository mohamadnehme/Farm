using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Skinet.Dtos
{
    public class OrderDto
    {
        public int ProductId { get; set; }
        public int quantity { get; set; }
        public Payment Payment { get; set; }
    }
}
