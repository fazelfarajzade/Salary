using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Interfaces;
using Salary.API.Core.Repository.Interfaces;
using Salary.API.Core;
using Salary.API.DTOs.Request;

namespace Salary.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IJwtAuth jwtAuth;
        private readonly IUserRepository _userRepo;

        public AuthenticationController(IJwtAuth jwtAuth, IUserRepository userRepo)
        {
            this.jwtAuth = jwtAuth;
            this._userRepo = userRepo;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Authentication([FromBody] AuthenticationDTO authenticationDTO)
        {
            bool execution = true;
            string warningMessage = "";
            string? token = null;
            User? user = null;
            DateTime ExpireDateTime = DateTime.Now.AddYears(1);
            if (execution)
            {
                try
                {
                    user = await _userRepo.GetUser(authenticationDTO.UserName, authenticationDTO.Password);
                }
                catch (Exception ex)
                {
                    execution = false;
                    warningMessage = ex.Message;
                }
            }
            if (execution)
            {
                token = jwtAuth.Authentication(user, ExpireDateTime);
                if (token == null)
                {
                    execution = false;
                    warningMessage = "نام کاربری یا کلمه عبور اشتباه است.";
                }
            }

            if (execution)
            {
                return Ok(new { Token = token, ExpireDateTime = ExpireDateTime.ToString("yyyy/MM/dd HH:mm:ss") });
            }
            return BadRequest(warningMessage);

        }
    }
}
