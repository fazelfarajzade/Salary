using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Salary.API.Core.Entities
{
    [Table("Debts")]
    public class Debt
    {
        public enum DebtTypes
        {
            LOAN = 1,
            FOOD = 2,
            VACATION = 3,
            OTHER = 10,
        }
        [Dapper.Contrib.Extensions.Key]
        public int DebtId { get; set; }
        [Required]
        public decimal Amount { get; set;}
        [Required]
        public DebtTypes Type { get; set; }
        public string? Description { get; set; }
        public DateTime RegDate { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int DebtYear { get; set; }
        [Required]
        public int DebtMonth { get; set; }

    }
}
