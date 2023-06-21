using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SalariesController : ControllerBase
    {
        private readonly ISalaryRepository _salaryRepo;
        public SalariesController(ISalaryRepository salaryRepo)
        {
            _salaryRepo = salaryRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetSalaries()
        {
            try
            {
                var salaries = await _salaryRepo.GetSalaries();
                return Ok(salaries);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSalary(int id)
        {
            try
            {
                var salaries = await _salaryRepo.GetSalary(id);
                return Ok(salaries);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Core.Entities.Salary salary)
        {
            try
            {
                var salaryId = await _salaryRepo.InsertSalary(salary);
                return Ok(salaryId);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Core.Entities.Salary salary)
        {
            try
            {
                salary.SalaryId = id;
                var updated = await _salaryRepo.UpdateSalary(salary);
                if(updated)
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
                var deleted = await _salaryRepo.DeleteSalary(id);
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
