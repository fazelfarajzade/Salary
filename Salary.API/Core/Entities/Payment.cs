using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Salary.API.Core.Entities
{
    [Table("Payments")]
    public class Payment
    {
        public enum PaymentTypes
        {
            //LOAN = 1,
            SALARY = 2,
            OTHER = 10,
        }
        [Dapper.Contrib.Extensions.Key]
        public int PaymentId { get; set; }
        public int UserId { get; set; }
        [Required]
        public PaymentTypes Type { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime PaymentDateTime { get; set; }
        [Required]
        public int PaymentYear { get; set; }
        [Required]
        public int PaymentMonth { get; set; }
        [Required]
        public decimal Amount { get; set; }
        //public int? CardId { get; set; }
    }
}
