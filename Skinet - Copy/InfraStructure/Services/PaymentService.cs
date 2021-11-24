using Core.Entities;
using Order = Core.Entities.OrderAggregate.Order;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;
using Core.Spesification;
using Product = Core.Entities.Product;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace InfraStructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> userManager;

        public PaymentService(IUnitOfWork unitOfWork, IConfiguration config, UserManager<AppUser> userManager)
        {
            _config = config;
            this.userManager = userManager;
            _unitOfWork = unitOfWork;
        }

        public async Task<Payment> CreateOrUpdatePaymentIntent(Product product, int quantity)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var service = new PaymentIntentService();

            PaymentIntent intent;

            Payment p = new Payment();

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(product.Price * quantity * 100),
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };
            intent = await service.CreateAsync(options);
            p.FarmeName = product.Name;
            p.Quantity = quantity;
            p.Price = product.Price;
            p.Total = product.Price * quantity;
            p.PaymentIntentId = intent.Id;
            p.ClientSecret = intent.ClientSecret;

            return p;
        }

        public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentWithItemsSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return null;

            order.Status = "PaymentFailed";
            _unitOfWork.Repository<Order>().Update(order);

            await _unitOfWork.Complete();

            return order;
        }

        public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentWithItemsSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (order == null) return null;

            order.Status = "PaymentReceived";
            _unitOfWork.Repository<Order>().Update(order);

            await _unitOfWork.Complete();

            return order;
        }
    }
}
