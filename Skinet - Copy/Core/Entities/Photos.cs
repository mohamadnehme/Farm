using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class Photos
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public int FarmId { get; set; }
        public bool IsProposal { get; set; }
    }
}
