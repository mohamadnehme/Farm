using Core.Entities.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Spesification
{
    public class OrdersWithItemsAndOrderingSpecification : BaseSpesification<Order>
    {
        public OrdersWithItemsAndOrderingSpecification(string email) : 
            base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddOrderByDescending(o => o.OrderDate);
        }

        public OrdersWithItemsAndOrderingSpecification(int id, string email)
            : base(o => o.Id == id && o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
        }
    }
}
