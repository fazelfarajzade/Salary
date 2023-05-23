using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Interfaces;
using Salary.API.Core.Repository.Interfaces;
using Salary.API.Core.Entities;

namespace Salary.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IJwtAuth _jwtAuth;


        public UsersController(IUserRepository userRepo, IJwtAuth jwtAuth)
        {
            this._userRepo = userRepo;
            this._jwtAuth = jwtAuth;
        }

        [HttpGet]
        public async Task<ActionResult> GetUsers()
        {
            try
            {
                var users = await _userRepo.GetUsers();
                return Ok(users.Where(x => x.Role == Core.Entities.User.Roles.Employee));
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser(int id)
        {
            try
            {
                var user = await _userRepo.GetUser(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/Salaries")]
        public async Task<IActionResult> GetUserSalaries(int id, [FromQuery] int? year)
        {
            try
            {
                var salaries = await _userRepo.GetUserSalaries(id, year);
                return Ok(salaries);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/Payments")]
        public async Task<IActionResult> GetUserPayments(int id, [FromQuery] int? year)
        {
            try
            {
                var payments = await _userRepo.GetUserPayments(id, year);
                //return Ok(payments.Select(x => new {
                //    x.Amount,
                //    x.Description,
                //    PaymentDate = x.PaymentDateTime.ToPersianDate(Resources.PersianTools.DateTypes.Persian).YMD,
                //    PaymentTime = x.PaymentDateTime.ToPersianDate(Resources.PersianTools.DateTypes.Persian).HHMMSS,
                //    x.PaymentId,
                //    x.PaymentYear,
                //    x.PaymentMonth,
                //    x.Type,
                //    x.UserId
                //}));
                return Ok(payments);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}/Debts")]
        public async Task<IActionResult> GetUserDebts(int id, [FromQuery] int? year)
        {
            try
            {
                var debts = await _userRepo.GetUserDebts(id, year);
                //return Ok(debts.Select(x => new {
                //    x.Amount,
                //    x.Description,
                //    DebtDate = x.DebtDateTime.ToPersianDate(Resources.PersianTools.DateTypes.Persian).YMD,
                //    DebtTime = x.DebtDateTime.ToPersianDate(Resources.PersianTools.DateTypes.Persian).HHMMSS,
                //    RegDate = x.RegDate.ToPersianDate(Resources.PersianTools.DateTypes.Persian).YMD_HHMMSS,
                //    x.DebtId,
                //    x.Type,
                //    x.UserId
                //}));
                return Ok(debts);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] User user)
        {
            try
            {
                user.Role = Core.Entities.User.Roles.Employee;
                user.UserName = null;
                user.Password = null;


                var userId = await _userRepo.InsertUser(user);
                return Ok(userId);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] User user)
        {
            try
            {
                user.Role = Core.Entities.User.Roles.Employee;
                user.UserName = null;
                user.Password = null;
                user.UserId = id;
                var updated = await _userRepo.UpdateUser(user);
                if (updated)
                    return Ok();
                else
                    return BadRequest("تغییری در اطلاعات ثبتی داده نشد.");
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _userRepo.DeleteUser(id);
                if (deleted)
                    return Ok();
                else
                    return BadRequest("تغییری در اطلاعات ثبتی داده نشد.");
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
    }
}
