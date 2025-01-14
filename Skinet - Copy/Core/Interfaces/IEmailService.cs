﻿
using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailInfo emailInfo);
        Task SendEmailTemplateAsync(EmailSource emailSource);
    }
}
