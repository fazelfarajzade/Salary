using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Salary.API.Core.Entities
{
    [Table("Loans")]
    public class Loan
    {
        [Dapper.Contrib.Extensions.Key]
        public int LoanId { get; set; }
        public int UserId { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required]
        public int Year { get; set; }
        [Required]
        public int Month { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public int NumberOfInstallments { get; set; }
    }
}
