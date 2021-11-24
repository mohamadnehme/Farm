using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InfraStructure.Data;
using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Spesification;
using AutoMapper;
using Skinet.Dtos;
using Skinet.Errors;
using Skinet.Helpers;
using Microsoft.Extensions.Options;
using DatingApp.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Identity;
using Skinet.Extensions;

namespace Skinet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : BaseController
    {
        private readonly IGenericRepository<Product> productRepo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudiaryConfig;
        private readonly IProposalRepository proposalRepo;
        private readonly UserManager<AppUser> userManager;
        private readonly IEmailService mailService;
        private readonly IPhotoRepository photoRepository;
        private Cloudinary cloudinary;

        public ProductsController(IGenericRepository<Product> productRepo,
            IMapper mapper, IOptions<CloudinarySettings> cloudiaryConfig,
            IProposalRepository proposalRepo,
            UserManager<AppUser> userManager,
            IEmailService mailService,
            IPhotoRepository photoRepository)
        {
            this.productRepo = productRepo;
            this.mapper = mapper;

            this.cloudiaryConfig = cloudiaryConfig;
            this.proposalRepo = proposalRepo;
            this.userManager = userManager;
            this.mailService = mailService;
            this.photoRepository = photoRepository;
            Account acc = new Account(
                cloudiaryConfig.Value.CloudName,
                cloudiaryConfig.Value.ApiKey,
                cloudiaryConfig.Value.ApiSecret
            );

            cloudinary = new Cloudinary(acc);
        }
        [HttpPost("addPhoto")]
        public async Task<IActionResult> AddPhotoForUser([FromForm] IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                await using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                    };
                    uploadResult = cloudinary.Upload(uploadParams);
                }
            }
            return Ok(new
            {
                id = uploadResult.PublicId,
                url = uploadResult.Uri.ToString()
            });
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<Product>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpesification(productParams);

            var countSpec = new ProductWithFiltersForCountSpesification(productParams);

            var totalItems = await productRepo.CountAsync(countSpec);

            var products = await productRepo.ListAsync(spec);

            return Ok(new Pagination<Product>(productParams.PageIndex, productParams.PageSize, totalItems, products));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpesification(id);

            var product = await productRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Pagination<Product>>> CreateProduct([FromBody]Product product)
        {
            product.TotalQuantity = product.UnitQuantity;
            productRepo.Add(product);
            
            productRepo.SaveChange();
            return await GetProducts(new ProductSpecParams());
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePhoto(string id)
        {

            var deleteParams = new DeletionParams(id);
            var result = cloudinary.Destroy(deleteParams);

            if (result.Result == "ok")
            {
                return Ok();
            }
            return BadRequest("Failed to delete the photo");
        }
        [HttpPost("createProposal")]
        public ActionResult createFarmP([FromBody] FarmProposal farmProposal)
        {
            
            foreach (var photo in farmProposal.Photos)
            {
                photo.IsProposal = true;
                photo.FarmId = farmProposal.Id;
            }
            proposalRepo.Add(farmProposal);
            proposalRepo.SaveChanges();
            return Ok();
        }
        [HttpGet("GetProposals")]
        public async Task<ActionResult<List<FarmProposal>>> getFarmProposals()
        {
            var farms = await proposalRepo.GetFarmProposals();
            return Ok(new
            {
                farms
            });
        }

        [HttpGet("GetProposalsA")]
        public async Task<ActionResult<List<FarmProposal>>> getFarmProposalsA()
        {
            var farms = await proposalRepo.GetFarmProposalsA();
            return Ok(new
            {
                farms
            });
        }

        [HttpGet("GetProposals/{id}")]
        public async Task<ActionResult<FarmProposal>> getFarmProposal(int id)
        {
            var farm = await proposalRepo.GetFarmProposal(id);
            return Ok(new
            {
                farm
            });
        }

        [HttpPost("sendEmail/{id}")]
        public async Task<ActionResult<FarmProposal>> SendMail([FromBody] EmailInfo emailInfo, int id)
        {
            AppUser user = await userManager.FindByEmailAsync(emailInfo.EmailTo);
            var f = await proposalRepo.GetFarmProposal(id);
                
            emailInfo.Subject = user == null ? "Hi " : "Hi "+ user.FirstName;

            emailInfo.Body = "We are accepted your farm proposal ." +
                "contact us for more details";
            try
            {
                await mailService.SendEmailAsync(emailInfo);
                f.IsApproval = true;

                proposalRepo.Update(f);
                proposalRepo.SaveChanges();

                return Ok(f);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse(400, ex.Message));
            }
        }
        

        [HttpPost("sendEmailPayment")]
        public async Task<ActionResult> SendMailPayment([FromBody] Payment payment)
        {
            EmailInfo emailInfo = new EmailInfo();

            AppUser user = await userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);

            if (user != null)
            {
                emailInfo.EmailTo = user.Email;

                emailInfo.Subject = "Hi " + user.FirstName + " Your payment has succeeded";

                emailInfo.Body = "Your payment : " +
                    " Farm Name: " + payment.FarmeName + " "  +
                    " Unit Quantity: " + payment.Quantity + " " +
                    " Price: " + payment.Price + " " +
                    " Total: " + payment.Total;
                try
                {
                    await mailService.SendEmailAsync(emailInfo);

                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(new ApiResponse(400, ex.Message));
                }
            }
            return BadRequest(new ApiResponse(400, "user not found"));
        }

        [HttpDelete("deleteFarmP/{farmId}")]
        public async Task<ActionResult<FarmProposal>> deleteFarmProposal(int farmId)
        {
            FarmProposal farm = await proposalRepo.GetFarmProposal(farmId);
            foreach (var photo in farm.Photos)
            {
                DeletePhoto(photo.Id);
            }
            proposalRepo.Delete(farm);
            proposalRepo.SaveChanges();
            return Ok(new
            {
                farm
            });
        }
        [HttpDelete("deleteProduct/{productId}")]
        public async Task<ActionResult<Product>> deleteProduct(int productId)
        {
            Product p = await productRepo.GetByIdAsync(productId);
            productRepo.Delete(p);
            productRepo.SaveChange();
            return p;
        }
    }
}
