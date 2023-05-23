using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly ILoanRepository _loanRepo;
        public LoansController(ILoanRepository loanRepo)
        {
            _loanRepo = loanRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetLoans()
        {
            try
            {
                var loans = await _loanRepo.GetLoans();
                return Ok(loans);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoan(int id)
        {
            try
            {
                var loans = await _loanRepo.GetLoan(id);
                return Ok(loans);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Loan loan)
        {
            try
            {
                loan.PaymentDateTime = DateTime.Now;
                var loanId = await _loanRepo.InsertLoan(loan);

                return Ok(loanId);
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
                var deleted = await _loanRepo.DeleteLoan(id);
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
