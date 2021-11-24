using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Skinet.Errors
{
    public class ApiException : ApiResponse
    {
        public ApiException(int statusCode, string details = null, string message = null) : base(statusCode, message)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }
        public string Details { get; set; }
    }
}
