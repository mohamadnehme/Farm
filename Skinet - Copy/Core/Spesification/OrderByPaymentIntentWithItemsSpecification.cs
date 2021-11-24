using Core.Entities.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Spesification
{
    public class OrderByPaymentIntentWithItemsSpecification : BaseSpesification<Order>
    {
        public OrderByPaymentIntentWithItemsSpecification(string paymentIntentId)
            : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}
