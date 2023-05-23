using Dapper.Contrib.Extensions;

namespace Salary.API.Core.Entities
{
    [Table("Salaries")]
    public class Salary
    {
        [Key]
        public int SalaryId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public int YearFrom { get; set; }
        public int MonthFrom { get; set; }
        public int YearTo { get; set; }
        public int MonthTo { get; set; }
    }
}
