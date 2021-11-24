using Core.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class UserRole : IdentityUserRole<string>
    {
        public int Id { get; set; }
        public AppUser User { get; set; }

        public Role Role { get; set; }
    }
}
