using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Salary.API.Filters
{
    public class ChangeErrorFormat : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var res = new APIErrorResponse()
                {
                    Success = false,
                    Message = "",
                    Errors = new Dictionary<string, List<string>>()
                };
                foreach (var error in context.ModelState)
                {
                    res.Message += string.Join(" <br> ", error.Value.Errors.Select(x => x.ErrorMessage));
                    res.Errors.Add(error.Key, error.Value.Errors.Select(x => x.ErrorMessage).ToList());
                }
                context.Result = new BadRequestObjectResult(res);
                base.OnResultExecuting(context);
            }
        }
    }
    public class APIErrorResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public Dictionary<string, List<string>>? Errors { get; set; }
    }
}
