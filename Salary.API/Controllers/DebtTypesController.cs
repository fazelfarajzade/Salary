using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DebtTypesController : ControllerBase
    {
        private readonly IDebtTypeRepository _debtTypeRepo;
        public DebtTypesController(IDebtTypeRepository debtTypeRepo) {
            _debtTypeRepo = debtTypeRepo;
        }
        [HttpGet]
        public async Task<ActionResult> getDebtTypes()
        {
            try
            {
                var debtTypes = await _debtTypeRepo.GetDebtTypes();
                return Ok(debtTypes);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("id")]
        public async Task<ActionResult> getDebtTypes(int id)
        {
            try
            {
                var debtType = await _debtTypeRepo.GetDebtType(id);
                return Ok(debtType);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
