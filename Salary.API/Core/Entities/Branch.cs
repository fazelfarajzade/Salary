using Dapper.Contrib.Extensions;

namespace Salary.API.Core.Entities
{
    [Table("Branchs")]
    public class Branch
    {
        [Key]
        public int BranchId { get; set; }
        public string BranchName { get; set; } = string.Empty;
    }
}
