using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Skinet.Dtos;
using Skinet.Errors;
using Skinet.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Skinet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : BaseController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
            this.mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);

            return new UserDto
            {
                Email = user.Email,
                Token = await tokenService.createTokenAsync(user),
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        [HttpGet("emailExist")]
        public async Task<ActionResult<bool>> CheckEmailExistAsync([FromQuery] string email)
        {
            return await userManager.FindByEmailAsync(email) != null;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new ApiResponse(401));
            }
            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new ApiResponse(401));
            }
            return new UserDto
            {
                Email = user.Email,
                Token = await tokenService.createTokenAsync(user),
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
            }

            string[] role = new string[]
            {
                "employee"
            };

            var user = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                PhoneNumber = registerDto.Phone
            };
            user.Id = Guid.NewGuid().ToString();
            var result = await userManager.CreateAsync(user, registerDto.Password);

            var result1 = await userManager.AddToRolesAsync(user, role);

            if (!result.Succeeded || !result1.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }

            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = await tokenService.createTokenAsync(user),
                Email = user.Email
            };
        }
        [HttpGet("users")]
        public async Task<ActionResult<RegisterDto>> getUsers()
        {
            var users = await userManager.Users.Where(u => !u.FirstName.Equals("admin")).ToListAsync();
            List<RegisterDto> u = new List<RegisterDto>();
            foreach (var user in users)
            {
                u.Add(new RegisterDto
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Phone = user.PhoneNumber
                });
            }
            return Ok(u);
        }

        [HttpGet("user")]
        public async Task<ActionResult<RegisterDto>> getUser()
        {
            var user = await userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);
            var userToReturn = new RegisterDto();

            return Ok(mapper.Map<AppUser, RegisterDto>(user, userToReturn));
            
        }


        [HttpPut("update")]
        public async Task<ActionResult<UserDto>> Update(UserForUpdate userForUpdate)
        {
            var user = await userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);

            user.FirstName = userForUpdate.FirstName;
            user.LastName = userForUpdate.LastName;
            user.PhoneNumber = userForUpdate.Phone;
            user.PasswordHash = userManager.PasswordHasher.HashPassword(user, userForUpdate.Password);

            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }

            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = await tokenService.createTokenAsync(user),
                Email = user.Email
            };
        }
    }
}
