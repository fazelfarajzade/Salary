using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DebtsController : ControllerBase
    {
        private readonly IDebtRepository _debtRepo;
        public DebtsController(IDebtRepository debtRepo)
        {
            _debtRepo = debtRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetDebts()
        {
            try
            {
                var debts = await _debtRepo.GetDebts();
                return Ok(debts);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDebt(int id)
        {
            try
            {
                var debts = await _debtRepo.GetDebt(id);
                return Ok(debts);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Debt debt)
        {
            try
            {
                debt.RegDate = DateTime.Now;
                var debtId = await _debtRepo.InsertDebt(debt);
                return Ok(debtId);
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
                var deleted = await _debtRepo.DeleteDebt(id);
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
