using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Salary.API.Core.Entities
{
    [Table("Credits")]
    public class Credit
    {
        public enum CreditTypes
        {
            BONUS = 1,
            OTHER = 10,
        }
        [Dapper.Contrib.Extensions.Key]
        public int CreditId { get; set; }
        [Required]
        public decimal Amount { get; set;}
        [Required]
        public CreditTypes Type { get; set; }
        public string? Description { get; set; }
        public DateTime RegDate { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int CreditYear { get; set; }
        [Required]
        public int CreditMonth { get; set; }

    }
}
