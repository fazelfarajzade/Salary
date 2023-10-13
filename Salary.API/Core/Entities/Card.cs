using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Salary.API.Core.Entities
{
    [Table("Cards")]
    public class Card
    {
        [Dapper.Contrib.Extensions.Key]
        public int CardId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public string CardNo { get; set; } = string.Empty;
        public DateTime RegDateTime { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
