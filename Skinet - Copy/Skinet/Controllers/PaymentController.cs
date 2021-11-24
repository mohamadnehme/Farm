using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Skinet.Errors;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Product = Core.Entities.Product;
using Skinet.Dtos;
using AutoMapper;

namespace Skinet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : BaseController
    {
        private readonly IPaymentService _paymentService;
        private const string WhSecret = "whsec_oBOc9Nnf4RV6GXpKzGeSWoT9vBz9R9Zm";
        private readonly ILogger<PaymentsController> _logger;
        private readonly IMapper mapper;

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger, IMapper mapper)
        {
            _logger = logger;
            this.mapper = mapper;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("{quantity}")]
        public async Task<ActionResult<Payment>> CreateOrUpdatePaymentIntent([FromBody] Product product, int quantity)
        {
            var p = await _paymentService.CreateOrUpdatePaymentIntent(product, quantity);

            if (p == null) return BadRequest(new ApiResponse(400, "Failed to create Payment intent"));

            return p;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WhSecret);

            PaymentIntent intent;
            Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Succeeded");
                    order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                    _logger.LogInformation("Order updated to payment received: ", order.Id);
                    break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment failed: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("Payment failed: ", order.Id);
                    break;
            }

            return new EmptyResult();
        }
    }
}
