using AutoMapper;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;
using Skinet.Dtos;


namespace Skinet.Helpers
{
    public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string>
    {
        private readonly IConfiguration _config;
        public OrderItemUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(OrderItem source, OrderItemDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.ItemOrdered.PictureUrl))
            {
                return source.ItemOrdered.PictureUrl;
            }

            return null;
        }
    }
}
