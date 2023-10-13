using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CreditsController : ControllerBase
    {
        private readonly ICreditRepository _creditRepo;
        public CreditsController(ICreditRepository creditRepo)
        {
            _creditRepo = creditRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetCredits()
        {
            try
            {
                var credits = await _creditRepo.GetCredits();
                return Ok(credits);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCredit(int id)
        {
            try
            {
                var credits = await _creditRepo.GetCredit(id);
                return Ok(credits);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Credit credit)
        {
            try
            {
                credit.RegDate = DateTime.Now;
                var creditId = await _creditRepo.InsertCredit(credit);
                return Ok(creditId);
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
                var deleted = await _creditRepo.DeleteCredit(id);
                if (deleted)
                    return Ok();
                else
                    return BadRequest("هیچ هزینه ای حذف نشد.");
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
    }
}
