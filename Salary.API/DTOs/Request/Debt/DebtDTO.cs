using Salary.API.ValidationAttributes;
using System.ComponentModel.DataAnnotations;
using static Salary.API.Core.Entities.Debt;

namespace Salary.API.DTOs.Request.Debt
{
    public class DebtDTO
    {
        public int? DebtId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DebtTypes Type { get; set; }
        public string? Description { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int DebtYear { get; set; }
        [Required]
        public int DebtMonth { get; set; }
        [PersianDate]
        public string DebtDate { get; set; } = string.Empty;
    }
}
