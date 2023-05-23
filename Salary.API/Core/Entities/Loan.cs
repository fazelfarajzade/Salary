using static Salary.API.Core.Entities.Payment;
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
        public DateTime PaymentDateTime { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public int NumberOfInstallments { get; set; }
    }
}
