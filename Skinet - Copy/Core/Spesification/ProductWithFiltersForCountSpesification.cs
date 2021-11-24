using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Spesification
{
    public class ProductWithFiltersForCountSpesification : BaseSpesification<Product>
    {
        public ProductWithFiltersForCountSpesification(ProductSpecParams productParams)
            : base(x =>
                (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)))
        {
        }
    }
}
