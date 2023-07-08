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
        public enum DebtReferenceTypes
        {
            LOAN = 1,
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
        public DebtReferenceTypes? DebtReferenceType { get; set; }
        public int? DebtReferenceId { get; set; }
        public DateTime DebtDate { get; set; }

    }
}
