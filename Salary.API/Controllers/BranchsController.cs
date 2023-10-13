using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BranchsController : ControllerBase
    {
        private readonly IBranchRepository _branchRepo;
        public BranchsController(IBranchRepository branchRepo)
        {
            _branchRepo = branchRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetBranchs()
        {
            try
            {
                var branchs = await _branchRepo.GetBranchs();
                return Ok(branchs);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBranch(int id)
        {
            try
            {
                var branchs = await _branchRepo.GetBranch(id);
                return Ok(branchs);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Branch branch)
        {
            try
            {
                var branchId = await _branchRepo.InsertBranch(branch);
                return Ok(branchId);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Branch branch)
        {
            try
            {
                branch.BranchId = id;
                var updated = await _branchRepo.UpdateBranch(branch);
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
                var deleted = await _branchRepo.DeleteBranch(id);
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
        [HttpGet("{id}/Users")]
        public async Task<IActionResult> GetBranchUsers(int id)
        {
            try
            {
                var branchs = await _branchRepo.GetBranchUsers(id);
                return Ok(branchs);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
    }
}
