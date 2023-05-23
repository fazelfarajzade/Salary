using Microsoft.IdentityModel.Tokens;
using Salary.API.Core.Entities;
using Salary.API.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Salary.API.Core
{
    public class Auth : IJwtAuth
    {
        private readonly string key;
        /// <summary>
        /// sets encrypt key
        /// </summary>
        /// <param name="key">string encrypt key</param>
        public Auth(string key)
        {
            this.key = key;
        }
        /// <summary>
        /// Returns Auth Tocken
        /// ID string generated is "T:Sepid.API.Classes.User.Authentication".
        /// </summary>
        /// <param name="user">User to get Token</param>
        public string? Authentication(User user, DateTime ExpireDateTime)
        {

            //var dbContext = new DapperContext() { }
            if (user == null)
                return null;
            // 1. Create Security Token Handler
            var tokenHandler = new JwtSecurityTokenHandler();

            // 2. Create Private Key to Encrypted
            var tokenKey = Encoding.ASCII.GetBytes(key);
            //3. Create JETdescriptor
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim("BranchId", user.BranchId.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.Name, (user.Name.ToString() + user.Family.ToString())),
            };
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = ExpireDateTime,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };
            //4. Create Token
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // 5. Return Token from method
            return tokenHandler.WriteToken(token);
        }
    }
}
