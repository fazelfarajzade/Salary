using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Authorize]
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
            if(loan.NumberOfInstallments > (12 - loan.Month))
                return BadRequest("اقساط وام باید تا انتهای سال جاری پرداخت شوند. در نتیجه تعداد اقساط نمی تواند بیش از " + (12 - loan.Month) + " باشد.");

            var installments = new List<Debt>();
            for(var i = loan.Month + 1; i <= 12; i++)
            {
                installments.Add(new Debt
                {
                    Amount = loan.Amount / loan.NumberOfInstallments,
                    DebtMonth = i,
                    DebtYear = loan.Year,
                    DebtReferenceId = null, // will change after insert loan
                    DebtReferenceType = Debt.DebtReferenceTypes.LOAN,
                    Description = " قسط وام : " + loan.Description,
                    RegDate = DateTime.Now,
                    Type = Debt.DebtTypes.LOAN,
                    UserId = loan.UserId,
                });
            }
            try
            {
                var loanId = await _loanRepo.InsertLoan(loan, installments);

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
