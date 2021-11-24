using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;
using Skinet.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Skinet.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, Product, string>
    {
        private readonly IConfiguration config;

        public ProductUrlResolver(IConfiguration config)
        {
            this.config = config;
        }

        public string Resolve(Product source, Product destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.PictureUrl))
            {
                return config["apiUrl"] + source.PictureUrl;
            }
            return null;
        }
    }
}
