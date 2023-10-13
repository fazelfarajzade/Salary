using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IBranchRepository _branchRepo;
        public TestController(IBranchRepository branchRepo)
        {
            _branchRepo = branchRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetBranchs()
        {
            try
            {
                var branchs = await _branchRepo.GetBranchs();
                //var report = new ViewAsPdf("Registration")
                //{
                //    PageMargins = { Left = 5, Bottom = 5, Right = 5, Top = 5 },
                //    //Model = reg
                //};
                return report;
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
    }
}
