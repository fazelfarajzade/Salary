using Dapper.Contrib.Extensions;

namespace Salary.API.Core.Entities
{
    [Table("DebtTypes")]
    public class DebtType
    {
        [Key]
        public int DebtTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PersianName { get; set; } = string.Empty;

    }
}
