using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace Salary.API.Core.Entities
{
    [Table("Users")]
    public class User
    {
        public enum Roles
        {
            Admin = 1,
            Employee = 2,
        }
        [Key]
        public int UserId { get; set; }
        public int BranchId { get; set; }
        public string? UserName { get; set; }
        [JsonIgnore]
        public string? Password { get; set; }
        public Roles Role { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Family { get; set; } = string.Empty;
        public string CardNo { get; set; } = string.Empty;
        public string AccountNo { get; set; } = string.Empty;
    }
}
