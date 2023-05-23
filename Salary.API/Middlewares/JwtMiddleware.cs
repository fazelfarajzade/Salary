using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Salary.API.Middlewares
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Check if the request contains a bearer token
            string token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token != null)
            {
                // Verify the signature of the token
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("HARmAGenTItaIlMAGeRAvEMiDenXiA"));
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = securityKey,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                };
                var handler = new JwtSecurityTokenHandler();
                try
                {
                    var claimsPrincipal = handler.ValidateToken(token, tokenValidationParameters, out var tokenSecure);
                    context.User = claimsPrincipal;

                    // Set the roles in the request context
                    var roleClaims = claimsPrincipal.Claims.Where(c => c.Type == ClaimTypes.Role);
                    context.Items["Roles"] = roleClaims.Select(c => c.Value).ToList();
                }
                catch
                {
                    // The token is not valid, do nothing
                }
            }

            // Call the next middleware in the pipeline
            await _next(context);
        }
    }
}
