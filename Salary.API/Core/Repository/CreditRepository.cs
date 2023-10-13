using Dapper.Contrib.Extensions;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;
using System.Data;

namespace Salary.API.Core.Repository
{
    public class CreditRepository : ICreditRepository
    {
        private readonly DapperContext _context;
        public CreditRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Credit?> GetCredit(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var credit = await connection.GetAsync<Credit>(id);
                return credit;
            }
        }

        public async Task<IEnumerable<Credit>> GetCredits()
        {
            //var query = "SELECT * FROM Credits";
            using (var connection = _context.CreateConnection())
            {
                var credits = await connection.GetAllAsync<Credit>();
                return credits.ToList();
            }
        }
        public async Task<int> InsertCredit(Credit credit, IDbTransaction? transaction = null)
        {
            //var query = "SELECT * FROM Salaries";
            using (var connection = _context.CreateConnection())
            {
                var creditId = await connection.InsertAsync<Credit>(credit, transaction);
                return creditId;
            }
        }
        public async Task<bool> DeleteCredit(int Id)
        {
            var credit = new Credit() { CreditId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<Credit>(credit);
                return deleted;
            }
        }
    }
}
