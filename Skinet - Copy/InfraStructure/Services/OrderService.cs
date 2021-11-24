using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Spesification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfraStructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _paymentService;
        private readonly UserManager<AppUser> userManager;

        public OrderService(IUnitOfWork unitOfWork,
            IPaymentService paymentService,
            UserManager<AppUser> userManager)
        {
            _paymentService = paymentService;
            this.userManager = userManager;
            _unitOfWork = unitOfWork;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int productId, Payment payment)
        {
            var items = new List<OrderItem>();
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(productId);
            if (product.UnitQuantity < payment.Quantity)
                return null;
            var user = await userManager.FindByEmailAsync(buyerEmail);
            var itemOrdered = new ProductItemOrdered(product.Id, product.Name, product.PictureUrl);
            var orderItem = new OrderItem(itemOrdered, product.Price, payment.Quantity);
            orderItem.Interest = product.Interest;
            product.UnitQuantity -= payment.Quantity;
            if (product.UnitQuantity <= 0)
                product.isSoldOut = true;
            Invester i = new Invester
            {
                UserId = user.Id,
                Email = buyerEmail,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Price = product.Price * payment.Quantity,
                Product = product,
                ProductId = product.Id,
                UnitQuantity = payment.Quantity,
                Phone = user.PhoneNumber
            };
            _unitOfWork.Repository<Invester>().Add(i);
            _unitOfWork.Repository<Product>().Update(product);
            items.Add(orderItem);


            // create order
            var order = new Order(items, buyerEmail, product.Price * payment.Quantity, payment.PaymentIntentId);
            _unitOfWork.Repository<Order>().Add(order);


            // TODO: save to db
            var result = await _unitOfWork.Complete();

            if (result <= 0) return null;

            // return order
            return order;
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<List<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}